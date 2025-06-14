import express from 'express';
import { verifyAuth } from '../middleware/auth';
import Course from '../models/Course';
import StudentProgress from '../models/StudentProgress';
import User from '../models/User';

const router = express.Router();

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

// Get all courses (admin only)
router.get('/admin/courses', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const courses = await Course.find({})
      .sort({ createdAt: -1 })
      .lean();

    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get specific course by courseName (admin only)
router.get('/admin/courses/:courseName', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { courseName } = req.params;
    const course = await Course.findOne({ courseName: courseName.toLowerCase() });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new course (admin only)
router.post('/admin/courses', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { courseName, displayName, description, topics, totalDuration } = req.body;

    console.log('Creating course with data:', JSON.stringify(req.body, null, 2));

    // Validate required fields
    if (!courseName || !displayName || !description || !topics || !totalDuration) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if course already exists
    const existingCourse = await Course.findOne({ courseName: courseName.toLowerCase() });
    if (existingCourse) {
      return res.status(400).json({ message: 'Course with this name already exists' });
    }

    // Ensure all topics, subtopics, and tasks have the required fields
    const processedTopics = topics.map((topic: any) => ({
      ...topic,
      estimatedTimeUnit: topic.estimatedTimeUnit || 'weeks',
      isCompleted: false,
      subtopics: topic.subtopics?.map((subtopic: any) => ({
        ...subtopic,
        estimatedTime: subtopic.estimatedTime || 1,
        estimatedTimeUnit: subtopic.estimatedTimeUnit || 'weeks',
        isCompleted: false,
        tasks: subtopic.tasks?.map((task: any) => ({
          ...task,
          estimatedTimeUnit: task.estimatedTimeUnit || 'hours',
          isCompleted: false
        })) || []
      })) || []
    }));

    const course = new Course({
      courseName: courseName.toLowerCase(),
      displayName,
      description,
      topics: processedTopics,
      totalDuration,
      createdBy: req.auth!.userId
    });

    await course.save();

    // Initialize progress for all students enrolled in this course
    const studentsWithThisCourse = await User.find({ 
      course: courseName.toLowerCase(),
      userType: 'student'
    });

    for (const student of studentsWithThisCourse) {
      await initializeStudentProgress(student.clerkId, course);
    }

    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    console.error('Error details:', error);
    
    // Send more detailed error information
    if (error instanceof Error) {
      res.status(500).json({ 
        message: 'Error creating course', 
        error: error.message,
        details: error.stack 
      });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

// Update course (admin only)
router.put('/admin/courses/:courseName', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { courseName } = req.params;
    const updates = req.body;

    console.log('Updating course with data:', JSON.stringify(updates, null, 2));

    // Process topics to ensure all required fields are present
    if (updates.topics) {
      updates.topics = updates.topics.map((topic: any) => ({
        ...topic,
        estimatedTimeUnit: topic.estimatedTimeUnit || 'weeks',
        isCompleted: topic.isCompleted !== undefined ? topic.isCompleted : false,
        subtopics: topic.subtopics?.map((subtopic: any) => ({
          ...subtopic,
          estimatedTime: subtopic.estimatedTime || 1,
          estimatedTimeUnit: subtopic.estimatedTimeUnit || 'weeks',
          isCompleted: subtopic.isCompleted !== undefined ? subtopic.isCompleted : false,
          tasks: subtopic.tasks?.map((task: any) => ({
            ...task,
            estimatedTimeUnit: task.estimatedTimeUnit || 'hours',
            isCompleted: task.isCompleted !== undefined ? task.isCompleted : false
          })) || []
        })) || []
      }));
    }

    const course = await Course.findOneAndUpdate(
      { courseName: courseName.toLowerCase() },
      updates,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    console.error('Error details:', error);
    
    if (error instanceof Error) {
      res.status(500).json({ 
        message: 'Error updating course', 
        error: error.message 
      });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

// Delete course (admin only)
router.delete('/admin/courses/:courseName', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { courseName } = req.params;

    const course = await Course.findOneAndDelete({ courseName: courseName.toLowerCase() });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Also delete all student progress for this course
    await StudentProgress.deleteMany({ courseName: courseName.toLowerCase() });

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get student's course materials (student only)
router.get('/student/course-materials', verifyAuth, async (req, res) => {
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

    // Get course details
    const course = await Course.findOne({ 
      courseName: student.course.toLowerCase(),
      isActive: true 
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found or inactive' });
    }

    // Get or create student progress
    let progress = await StudentProgress.findOne({ 
      studentId: userId, 
      courseName: student.course.toLowerCase() 
    });

    if (!progress) {
      progress = await initializeStudentProgress(userId, course);
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
    console.error('Error fetching course materials:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update student progress (student only)
router.put('/student/progress', verifyAuth, async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const { topicIndex, subtopicIndex, taskIndex, isCompleted, timeSpent, notes } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const student = await User.findOne({ clerkId: userId });
    if (!student || student.userType !== 'student') {
      return res.status(403).json({ message: 'Access denied. Student privileges required.' });
    }

    const progress = await StudentProgress.findOne({ 
      studentId: userId, 
      courseName: student.course?.toLowerCase() 
    });

    if (!progress) {
      return res.status(404).json({ message: 'Student progress not found' });
    }

    // Update specific task progress
    const topic = progress.topics[topicIndex];
    if (!topic) {
      return res.status(400).json({ message: 'Invalid topic index' });
    }

    const subtopic = topic.subtopics[subtopicIndex];
    if (!subtopic) {
      return res.status(400).json({ message: 'Invalid subtopic index' });
    }

    const task = subtopic.tasks[taskIndex];
    if (!task) {
      return res.status(400).json({ message: 'Invalid task index' });
    }

    // Update task
    task.isCompleted = isCompleted;
    if (isCompleted && !task.completedAt) {
      task.completedAt = new Date();
    }
    if (timeSpent) {
      task.timeSpent = (task.timeSpent || 0) + timeSpent;
      progress.totalTimeSpent += timeSpent;
    }
    if (notes) {
      task.notes = notes;
    }

    // Check if subtopic is completed
    const allTasksCompleted = subtopic.tasks.every(t => t.isCompleted);
    if (allTasksCompleted && !subtopic.isCompleted) {
      subtopic.isCompleted = true;
      subtopic.completedAt = new Date();
    }

    // Check if topic is completed
    const allSubtopicsCompleted = topic.subtopics.every(s => s.isCompleted);
    if (allSubtopicsCompleted && !topic.isCompleted) {
      topic.isCompleted = true;
      topic.completedAt = new Date();
    }

    // Calculate overall progress
    const totalTasks = progress.topics.reduce((total, t) => 
      total + t.subtopics.reduce((subTotal, s) => subTotal + s.tasks.length, 0), 0
    );
    const completedTasks = progress.topics.reduce((total, t) => 
      total + t.subtopics.reduce((subTotal, s) => 
        subTotal + s.tasks.filter(task => task.isCompleted).length, 0
      ), 0
    );
    
    progress.overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    progress.lastAccessedAt = new Date();

    // Check if course is completed
    const allTopicsCompleted = progress.topics.every(t => t.isCompleted);
    if (allTopicsCompleted && !progress.completedAt) {
      progress.completedAt = new Date();
    }

    await progress.save();

    res.json(progress);
  } catch (error) {
    console.error('Error updating student progress:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Helper function to initialize student progress
async function initializeStudentProgress(studentId: string, course: any) {
  const topics = course.topics.map((topic: any, topicIndex: number) => ({
    topicIndex,
    isCompleted: false,
    subtopics: topic.subtopics.map((subtopic: any, subtopicIndex: number) => ({
      subtopicIndex,
      isCompleted: false,
      tasks: subtopic.tasks.map((task: any, taskIndex: number) => ({
        taskIndex,
        isCompleted: false,
        timeSpent: 0
      }))
    }))
  }));

  const progress = new StudentProgress({
    studentId,
    courseName: course.courseName,
    courseId: course._id.toString(),
    topics,
    overallProgress: 0,
    totalTimeSpent: 0
  });

  await progress.save();
  return progress;
}

export default router; 