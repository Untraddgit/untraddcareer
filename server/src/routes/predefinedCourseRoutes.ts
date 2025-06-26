import express from 'express';
import { verifyAuth } from '../middleware/auth';
import PredefinedCourse, { IPredefinedCourse } from '../models/PredefinedCourse';
import PredefinedCourseProgress from '../models/PredefinedCourseProgress';
import AssignmentSubmission from '../models/AssignmentSubmission';
import User from '../models/User';
import multer from 'multer';
import path from 'path';
import { Types } from 'mongoose';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/assignments/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip|rar/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Middleware to check if user is admin
const verifyAdmin = async (req: any, res: any, next: any) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user || user.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error verifying admin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all predefined courses (admin only)
router.get('/admin/predefined-courses', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const courses = await PredefinedCourse.find({ isActive: true })
      .sort({ courseName: 1 })
      .lean();

    res.json(courses);
  } catch (error) {
    console.error('Error fetching predefined courses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get specific predefined course by courseName (admin only)
router.get('/admin/predefined-courses/:courseName', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { courseName } = req.params;
    const decodedCourseName = decodeURIComponent(courseName);
    const course = await PredefinedCourse.findOne({ 
      courseName: decodedCourseName.toLowerCase(),
      isActive: true 
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Error fetching predefined course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all students enrolled in a specific course with their progress (admin only)
router.get('/admin/predefined-courses/:courseName/students', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { courseName } = req.params;
    const decodedCourseName = decodeURIComponent(courseName);
    
    // Get all students enrolled in this course
    const students = await User.find({ 
      course: decodedCourseName.toLowerCase(),
      userType: 'student'
    }).select('clerkId email firstName lastName course').lean();

    // Get progress for each student
    const studentsWithProgress = await Promise.all(
      students.map(async (student) => {
        const progress = await PredefinedCourseProgress.findOne({
          studentId: student.clerkId,
          courseName: decodedCourseName.toLowerCase()
        });

        return {
          ...student,
          progress: progress || null
        };
      })
    );

    res.json(studentsWithProgress);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Mark module as complete/incomplete (admin only)
router.put('/admin/predefined-courses/:courseName/students/:studentId/modules/:week', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { courseName, studentId, week } = req.params;
    const { isCompleted, notes } = req.body;
    const adminId = req.auth?.userId;
    const decodedCourseName = decodeURIComponent(courseName);

    const weekNumber = parseInt(week);
    if (isNaN(weekNumber) || weekNumber < 1) {
      return res.status(400).json({ message: 'Invalid week number' });
    }

    // Find or create progress record
    let progress = await PredefinedCourseProgress.findOne({
      studentId,
      courseName: decodedCourseName.toLowerCase()
    });

    if (!progress) {
      // Initialize progress if it doesn't exist
      const course = await PredefinedCourse.findOne({ 
        courseName: decodedCourseName.toLowerCase(),
        isActive: true 
      });

      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      progress = await initializePredefinedCourseProgress(studentId, course);
    }

    // Find the module to update
    const moduleIndex = progress.modules.findIndex(m => m.week === weekNumber);
    if (moduleIndex === -1) {
      return res.status(404).json({ message: 'Module not found' });
    }

    const module = progress.modules[moduleIndex];
    
    // Update module completion status
    module.isCompleted = isCompleted;
    module.completedBy = isCompleted ? adminId : undefined;
    module.completedAt = isCompleted ? new Date() : undefined;
    module.notes = notes || '';

    // If marking as complete, unlock the next module
    if (isCompleted && weekNumber < progress.modules.length) {
      const nextModuleIndex = progress.modules.findIndex(m => m.week === weekNumber + 1);
      if (nextModuleIndex !== -1) {
        progress.modules[nextModuleIndex].isLocked = false;
      }
      progress.currentWeek = Math.max(progress.currentWeek, weekNumber + 1);
    }

    // If marking as incomplete, lock subsequent modules
    if (!isCompleted) {
      progress.modules.forEach(m => {
        if (m.week > weekNumber) {
          m.isLocked = true;
          m.isCompleted = false;
          m.completedAt = undefined;
          m.completedBy = undefined;
        }
      });
      progress.currentWeek = weekNumber;
    }

    // Calculate overall progress
    const completedModules = progress.modules.filter(m => m.isCompleted).length;
    progress.overallProgress = Math.round((completedModules / progress.modules.length) * 100);

    // Check if course is completed
    const allModulesCompleted = progress.modules.every(m => m.isCompleted);
    if (allModulesCompleted && !progress.completedAt) {
      progress.completedAt = new Date();
    } else if (!allModulesCompleted && progress.completedAt) {
      progress.completedAt = undefined;
    }

    await progress.save();

    res.json(progress);
  } catch (error) {
    console.error('Error updating module completion:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get foundation training course for premium students (student only)
router.get('/student/foundation-course', verifyAuth, async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get student details
    const student = await User.findOne({ clerkId: userId });
    if (!student || student.userType !== 'student') {
      return res.status(403).json({ message: 'Access denied. Student privileges required.' });
    }

    // Check if student has premium plan
    if (student.plan !== 'premium') {
      return res.status(403).json({ message: 'Access denied. Premium plan required.' });
    }

    // Get the specific foundation training course
    const course = await PredefinedCourse.findOne({ 
      courseName: 'foundationtraining',
      isActive: true 
    });

    if (!course) {
      return res.status(404).json({ message: 'Foundation training course not found' });
    }

    // Get or create student progress for this course
    let progress = await PredefinedCourseProgress.findOne({
      studentId: userId,
      courseName: 'foundationtraining'
    });

    if (!progress) {
      progress = await initializePredefinedCourseProgress(userId, course);
    } else {
      // Update last accessed time
      progress.lastAccessedAt = new Date();
      await progress.save();
    }

    res.json({
      course,
      progress
    });
  } catch (error) {
    console.error('Error fetching foundation course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Get student's predefined course materials (student only)
router.get('/student/predefined-course-materials', verifyAuth, async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get student's course
    const student = await User.findOne({ clerkId: userId });
    if (!student || student.userType !== 'student') {
      return res.status(403).json({ message: 'Access denied. Student privileges required.' });
    }

    if (!student.course) {
      return res.status(404).json({ message: 'No course assigned to this student' });
    }

    // Get predefined course details
    const course = await PredefinedCourse.findOne({ 
      courseName: student.course.toLowerCase(),
      isActive: true 
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found or inactive' });
    }

    // Get or create student progress
    let progress = await PredefinedCourseProgress.findOne({ 
      studentId: userId, 
      courseName: student.course.toLowerCase() 
    });

    if (!progress) {
      progress = await initializePredefinedCourseProgress(userId, course);
    } else {
      // Update last accessed time
      progress.lastAccessedAt = new Date();
      await progress.save();
    }

    res.json({
      course,
      progress
    });
  } catch (error) {
    console.error('Error fetching predefined course materials:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get student's predefined course materials (admin can view any student)
router.get('/admin/predefined-courses/:courseName/students/:studentId/materials', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { courseName, studentId } = req.params;
    const decodedCourseName = decodeURIComponent(courseName);

    // Get predefined course details
    const course = await PredefinedCourse.findOne({ 
      courseName: decodedCourseName.toLowerCase(),
      isActive: true 
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found or inactive' });
    }

    // Get student progress
    let progress = await PredefinedCourseProgress.findOne({ 
      studentId, 
      courseName: decodedCourseName.toLowerCase() 
    });

    if (!progress) {
      progress = await initializePredefinedCourseProgress(studentId, course);
    }

    res.json({
      course,
      progress
    });
  } catch (error) {
    console.error('Error fetching student course materials:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Helper function to initialize predefined course progress
async function initializePredefinedCourseProgress(studentId: string, course: IPredefinedCourse) {
  const modules = course.weeklyRoadmap.map((week: any, index: number) => ({
    week: week.week,
    isCompleted: false,
    isLocked: false, // All modules are now unlocked for students
    completedAt: undefined,
    completedBy: undefined,
    notes: ''
  }));

  const progress = new PredefinedCourseProgress({
    studentId,
    courseName: course.courseName,
    courseId: (course as { _id: any })._id.toString(),
    modules,
    overallProgress: 0,
    currentWeek: 1,
    totalTimeSpent: 0
  });

  await progress.save();
  return progress;
}

// Update course (admin only) - Add/Edit resources and assignments
router.put('/admin/predefined-courses/:courseName', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { courseName } = req.params;
    const updateData = req.body;
    const decodedCourseName = decodeURIComponent(courseName);

    const course = await PredefinedCourse.findOneAndUpdate(
      { courseName: decodedCourseName.toLowerCase(), isActive: true },
      updateData,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add resource to a specific week (admin only)
router.post('/admin/predefined-courses/:courseName/weeks/:week/resources', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { courseName, week } = req.params;
    const { title, url, type } = req.body;
    const decodedCourseName = decodeURIComponent(courseName);

    const weekNumber = parseInt(week);
    if (isNaN(weekNumber) || weekNumber < 1) {
      return res.status(400).json({ message: 'Invalid week number' });
    }

    const course = await PredefinedCourse.findOne({ 
      courseName: decodedCourseName.toLowerCase(),
      isActive: true 
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const weekModule = course.weeklyRoadmap.find(w => w.week === weekNumber);
    if (!weekModule) {
      return res.status(404).json({ message: 'Week not found' });
    }

    if (!weekModule.resources) {
      weekModule.resources = [];
    }

    weekModule.resources.push({ title, url, type });
    await course.save();

    res.json(course);
  } catch (error) {
    console.error('Error adding resource:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add assignment to a specific week (admin only)
router.post('/admin/predefined-courses/:courseName/weeks/:week/assignments', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { courseName, week } = req.params;
    const { title, description, dueDate, maxScore, instructions } = req.body;
    const decodedCourseName = decodeURIComponent(courseName);

    const weekNumber = parseInt(week);
    if (isNaN(weekNumber) || weekNumber < 1) {
      return res.status(400).json({ message: 'Invalid week number' });
    }

    const course = await PredefinedCourse.findOne({ 
      courseName: decodedCourseName.toLowerCase(),
      isActive: true 
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const weekModule = course.weeklyRoadmap.find(w => w.week === weekNumber);
    if (!weekModule) {
      return res.status(404).json({ message: 'Week not found' });
    }

    if (!weekModule.assignments) {
      weekModule.assignments = [];
    }

    weekModule.assignments.push({ 
      title, 
      description, 
      dueDate: dueDate ? new Date(dueDate) : undefined,
      maxScore,
      instructions 
    });
    await course.save();

    res.json(course);
  } catch (error) {
    console.error('Error adding assignment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Submit assignment (student only)
router.post('/student/assignments/:week', verifyAuth, async (req, res) => {
  try {
    const { week } = req.params;
    const { assignmentId, submissionLink,module,maxScore,title,} = req.body;
    const studentId = req.auth?.userId;

    if (!studentId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find student's course progress
    const progress = await PredefinedCourseProgress.findOne({ studentId });
    if (!progress) {
      return res.status(404).json({ message: 'Course progress not found' });
    }

    // Find the course
    const course = await PredefinedCourse.findOne({ courseName: progress.courseName });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Find the week's module
    const weekModule = course.weeklyRoadmap.find(w => w.week === parseInt(week));
    if (!weekModule) {
      return res.status(404).json({ message: 'Week module not found' });
    }

    // Find the assignment
    const assignment = weekModule.assignments?.find(a => a._id?.toString() === assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Create or update assignment submission
    const submission = await AssignmentSubmission.findOneAndUpdate(
      {
        studentId,
        courseId: course._id,
        week: parseInt(week),
        assignmentId,
        module,
        maxScore,
        title,
      },
      {
        submissionLink,
        submittedAt: new Date(),
        status: 'pending'
      },
      { upsert: true, new: true }
    );

    res.json(submission);
  } catch (error) {
    console.error('Error submitting assignment:', error);
    res.status(500).json({ message: 'Error submitting assignment' });
  }
});

// Get student's assignment submissions
router.get('/student/assignments', verifyAuth, async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const student = await User.findOne({ clerkId: userId });
    if (!student || student.userType !== 'student') {
      return res.status(403).json({ message: 'Access denied. Student privileges required.' });
    }

    const submissions = await AssignmentSubmission.find({
      studentId: userId
    }).sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get student's own assignment submissions with detailed info
router.get('/student/my-submissions', verifyAuth, async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const student = await User.findOne({ clerkId: userId });
    if (!student || student.userType !== 'student') {
      return res.status(403).json({ message: 'Access denied. Student privileges required.' });
    }

    const submissions = await AssignmentSubmission.find({
      studentId: userId
    }).sort({ submittedAt: -1 }).lean();

    // Enhance submissions with assignment details
    const enhancedSubmissions = await Promise.all(
      submissions.map(async (submission) => {
        // Find the course and assignment details
        const course = await PredefinedCourse.findById(submission.courseId);
        if (course) {
          const weekModule = course.weeklyRoadmap.find(w => w.week === submission.week);
          if (weekModule) {
            const assignment = weekModule.assignments?.find(a => a._id?.toString() === submission.assignmentId);
            if (assignment) {
              return {
                ...submission,
                assignmentTitle: assignment.title,
                assignmentDescription: assignment.description,
                maxScore: assignment.maxScore,
                courseName: course.courseName,
                displayName: course.displayName || course.courseName,
                isGraded: submission.status === 'graded' && submission.score !== undefined
              };
            }
          }
        }
        return {
          ...submission,
          isGraded: submission.status === 'graded' && submission.score !== undefined
        };
      })
    );

    res.json(enhancedSubmissions);
  } catch (error) {
    console.error('Error fetching student submissions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all assignment submissions for a course (admin only)
router.get('/admin/assignments/:courseId', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Directly fetch all submissions for this course
    const submissions = await AssignmentSubmission.find({ courseId })
      .sort({ submittedAt: -1 })
      .lean();

    console.log('Found submissions:', submissions);

    // Get student details for each submission
    const submissionsWithStudents = await Promise.all(
      submissions.map(async (submission) => {
        const student = await User.findOne({ clerkId: submission.studentId })
          .select('firstName lastName email')
          .lean();
        
        return {
          ...submission,
          student
        };
      })
    );

    console.log('Submissions with students:', submissionsWithStudents);
    res.json(submissionsWithStudents);
  } catch (error) {
    console.error('Error fetching assignment submissions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Grade assignment (admin only)
router.put('/admin/assignments/:submissionId/grade', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { score, feedback, isGraded } = req.body;
    const adminId = req.auth?.userId;

    const submission = await AssignmentSubmission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Update submission with grading information
    submission.score = score;
    submission.feedback = feedback;
    submission.status = isGraded ? 'graded' : 'pending';
    submission.gradedBy = isGraded ? adminId : undefined;
    submission.gradedAt = isGraded ? new Date() : undefined;

    await submission.save();

    res.json(submission);
  } catch (error) {
    console.error('Error grading assignment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get student's assignment submissions (admin only)
router.get('/admin/predefined-courses/:courseName/students/:studentId/submissions', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { courseName, studentId } = req.params;
    const decodedCourseName = decodeURIComponent(courseName);

    const submissions = await AssignmentSubmission.find({
      studentId,
      courseName: decodedCourseName.toLowerCase()
    }).sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Error fetching submissions' });
  }
});

// Update submission status (admin only)
router.put('/admin/predefined-courses/:courseName/submissions/:submissionId', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { status, feedback } = req.body;

    const submission = await AssignmentSubmission.findByIdAndUpdate(
      submissionId,
      {
        status,
        feedback,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.json(submission);
  } catch (error) {
    console.error('Error updating submission:', error);
    res.status(500).json({ message: 'Error updating submission' });
  }
});

// Get all assignment submissions (admin only)
router.get('/admin/all-submissions', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    // Fetch all submissions
    const submissions = await AssignmentSubmission.find()
      .sort({ submittedAt: -1 })
      .lean();

    console.log('Raw submissions from database:', JSON.stringify(submissions, null, 2));

    // Get student details for each submission
    const submissionsWithStudents = await Promise.all(
      submissions.map(async (submission) => {
        console.log('Processing submission:', JSON.stringify(submission, null, 2));
        
        const student = await User.findOne({ clerkId: submission.studentId })
          .select('firstName lastName email')
          .lean();
        
        // Get course and assignment details
        const course = await PredefinedCourse.findById(submission.courseId);
        const weekModule = course?.weeklyRoadmap.find(w => w.week === submission.week);
        const assignment = weekModule?.assignments?.find(a => a._id?.toString() === submission.assignmentId);
        
        const result = {
          ...submission,
          student,
          assignmentTitle: assignment?.title || 'Unknown Assignment',
          maxScore: assignment?.maxScore || 100
        };
        
        console.log('Processed submission result:', JSON.stringify(result, null, 2));
        return result;
      })
    );

    console.log('Final submissions with details:', JSON.stringify(submissionsWithStudents, null, 2));
    res.json(submissionsWithStudents);
  } catch (error) {
    console.error('Error fetching all submissions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router; 