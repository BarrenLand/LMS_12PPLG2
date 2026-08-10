export interface GoCodeFile {
  filename: string;
  language: string;
  description: string;
  code: string;
}

export const GOLANG_BACKEND_FILES: GoCodeFile[] = [
  {
    filename: 'main.go',
    language: 'go',
    description: 'Golang REST API Server Entry Point with Gin framework & CORS',
    code: `package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"golang-lms-backend/database"
	"golang-lms-backend/handlers"
)

func main() {
	// Initialize Database (SQLite/PostgreSQL)
	database.InitDB()

	// Setup Gin Engine
	r := gin.Default()

	// Enable CORS for frontend cross-origin requests
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	r.Use(cors.New(config))

	// Health Check
	r.GET("/api/v1/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "online",
			"engine":  "Golang Gin REST API",
			"version": "1.0.0",
		})
	})

	// API Route Group
	api := r.Group("/api/v1")
	{
		// --- Admin Routes ---
		admin := api.Group("/admin")
		{
			admin.GET("/users", handlers.GetAllUsers)
			admin.POST("/users", handlers.CreateUser)
			admin.DELETE("/users/:id", handlers.DeleteUser)

			admin.GET("/classes", handlers.GetAllClasses)
			admin.POST("/classes", handlers.CreateClass)
			admin.PUT("/classes/:id", handlers.UpdateClass)
			admin.DELETE("/classes/:id", handlers.DeleteClass)
		}

		// --- Teacher Routes ---
		teacher := api.Group("/teacher")
		{
			teacher.POST("/tasks", handlers.CreateTask)
			teacher.DELETE("/tasks/:id", handlers.DeleteTask)
			teacher.GET("/tasks/:id/submissions", handlers.GetTaskSubmissions)
			teacher.POST("/submissions/:id/grade", handlers.GradeSubmission)

			teacher.POST("/materials", handlers.UploadMaterial)
			teacher.DELETE("/materials/:id", handlers.DeleteMaterial)
		}

		// --- Student Routes ---
		student := api.Group("/student")
		{
			student.GET("/materials", handlers.GetClassMaterials)
			student.POST("/submissions", handlers.SubmitGDriveTask)
			student.GET("/submissions/my", handlers.GetMySubmissions)
		}

		// --- Forum Routes (Shared) ---
		forum := api.Group("/forum")
		{
			forum.GET("/posts", handlers.GetForumPosts)
			forum.POST("/posts", handlers.CreateForumPost)
			forum.POST("/posts/:id/comments", handlers.AddForumComment)
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Golang LMS Server listening on port %s...", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
`,
  },
  {
    filename: 'models/models.go',
    language: 'go',
    description: 'GORM Database Struct Models for Users, Classes, Tasks, Submissions, Materials, and Forums',
    code: `package models

import (
	"time"

	"gorm.io/gorm"
)

type UserRole string

const (
	RoleAdmin   UserRole = "admin"
	RoleTeacher UserRole = "teacher"
	RoleStudent UserRole = "student"
)

// User represents LMS account entities
type User struct {
	ID        string         \`gorm:"primaryKey;type:varchar(64)" json:"id"\`
	Name      string         \`gorm:"not null" json:"name"\`
	Email     string         \`gorm:"uniqueIndex;not null" json:"email"\`
	Role      UserRole       \`gorm:"type:varchar(20);not null" json:"role"\`
	Avatar    string         \`json:"avatar"\`
	CreatedAt time.Time      \`json:"createdAt"\`
	UpdatedAt time.Time      \`json:"updatedAt"\`
	DeletedAt gorm.DeletedAt \`gorm:"index" json:"-"\`
}

// Class represents academic courses created by Admin
type Class struct {
	ID          string    \`gorm:"primaryKey;type:varchar(64)" json:"id"\`
	Name        string    \`gorm:"not null" json:"name"\`
	Code        string    \`gorm:"uniqueIndex;not null" json:"code"\`
	TeacherID   string    \`gorm:"type:varchar(64)" json:"teacherId"\`
	Teacher     User      \`gorm:"foreignKey:TeacherID" json:"teacher,omitempty"\`
	Description string    \`json:"description"\`
	CreatedAt   time.Time \`json:"createdAt"\`
}

// StudyMaterial uploaded by Teachers
type StudyMaterial struct {
	ID          string    \`gorm:"primaryKey;type:varchar(64)" json:"id"\`
	Title       string    \`gorm:"not null" json:"title"\`
	Description string    \`json:"description"\`
	ClassID     string    \`gorm:"index;not null" json:"classId"\`
	AuthorID    string    \`json:"authorId"\`
	Type        string    \`gorm:"type:varchar(20)" json:"type"\` // pdf, video, link, doc
	URL         string    \`gorm:"not null" json:"url"\`
	CreatedAt   time.Time \`json:"createdAt"\`
}

// Task / Assignment created by Teacher
type Task struct {
	ID           string    \`gorm:"primaryKey;type:varchar(64)" json:"id"\`
	Title        string    \`gorm:"not null" json:"title"\`
	Instructions string    \`json:"instructions"\`
	ClassID      string    \`gorm:"index;not null" json:"classId"\`
	TeacherID    string    \`json:"teacherId"\`
	MaxScore     int       \`gorm:"default:100" json:"maxScore"\`
	DueDate      time.Time \`json:"dueDate"\`
	CreatedAt    time.Time \`json:"createdAt"\`
}

// TaskSubmission uploaded by Student via Google Drive link
type TaskSubmission struct {
	ID          string     \`gorm:"primaryKey;type:varchar(64)" json:"id"\`
	TaskID      string     \`gorm:"index;not null" json:"taskId"\`
	StudentID   string     \`gorm:"index;not null" json:"studentId"\`
	Student     User       \`gorm:"foreignKey:StudentID" json:"student,omitempty"\`
	GDriveURL   string     \`gorm:"not null" json:"gdriveUrl"\` // Google Drive link
	Note        string     \`json:"note"\`
	SubmittedAt time.Time  \`json:"submittedAt"\`
	Score       *int       \`json:"score"\`
	Feedback    string     \`json:"feedback"\`
}

// ForumPost for class discussions
type ForumPost struct {
	ID        string         \`gorm:"primaryKey;type:varchar(64)" json:"id"\`
	Title     string         \`gorm:"not null" json:"title"\`
	Content   string         \`json:"content"\`
	ClassID   string         \`gorm:"index;not null" json:"classId"\`
	AuthorID  string         \`json:"authorId"\`
	Author    User           \`gorm:"foreignKey:AuthorID" json:"author,omitempty"\`
	IsPinned  bool           \`gorm:"default:false" json:"isPinned"\`
	CreatedAt time.Time      \`json:"createdAt"\`
	Comments  []ForumComment \`gorm:"foreignKey:PostID" json:"comments,omitempty"\`
}

type ForumComment struct {
	ID        string    \`gorm:"primaryKey;type:varchar(64)" json:"id"\`
	PostID    string    \`gorm:"index;not null" json:"postId"\`
	AuthorID  string    \`json:"authorId"\`
	Author    User      \`gorm:"foreignKey:AuthorID" json:"author,omitempty"\`
	Content   string    \`gorm:"not null" json:"content"\`
	CreatedAt time.Time \`json:"createdAt"\`
}
`,
  },
  {
    filename: 'handlers/lms_handlers.go',
    language: 'go',
    description: 'HTTP Controller Handlers implementing Admin, Teacher, and Student features',
    code: `package handlers

import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"golang-lms-backend/database"
	"golang-lms-backend/models"
)

// --- ADMIN HANDLERS ---

func GetAllClasses(c *gin.Context) {
	var classes []models.Class
	database.DB.Preload("Teacher").Find(&classes)
	c.JSON(http.StatusOK, classes)
}

func CreateClass(c *gin.Context) {
	var req struct {
		Name        string \`json:"name" binding:"required"\`
		Code        string \`json:"code" binding:"required"\`
		TeacherID   string \`json:"teacherId" binding:"required"\`
		Description string \`json:"description"\`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	newClass := models.Class{
		ID:          "cls-" + time.Now().Format("20060102150405"),
		Name:        req.Name,
		Code:        req.Code,
		TeacherID:   req.TeacherID,
		Description: req.Description,
		CreatedAt:   time.Now(),
	}

	database.DB.Create(&newClass)
	c.JSON(http.StatusCreated, newClass)
}

func DeleteClass(c *gin.Context) {
	classID := c.Param("id")
	database.DB.Delete(&models.Class{}, "id = ?", classID)
	c.JSON(http.StatusOK, gin.H{"message": "Class deleted successfully"})
}

// --- TEACHER HANDLERS ---

func CreateTask(c *gin.Context) {
	var task models.Task
	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	task.ID = "task-" + time.Now().Format("20060102150405")
	task.CreatedAt = time.Now()

	database.DB.Create(&task)
	c.JSON(http.StatusCreated, task)
}

func GradeSubmission(c *gin.Context) {
	submissionID := c.Param("id")
	var req struct {
		Score    int    \`json:"score"\`
		Feedback string \`json:"feedback"\`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var sub models.TaskSubmission
	if err := database.DB.First(&sub, "id = ?", submissionID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Submission not found"})
		return
	}

	sub.Score = &req.Score
	sub.Feedback = req.Feedback
	database.DB.Save(&sub)

	c.JSON(http.StatusOK, sub)
}

// --- STUDENT HANDLERS ---

func SubmitGDriveTask(c *gin.Context) {
	var req struct {
		TaskID    string \`json:"taskId" binding:"required"\`
		StudentID string \`json:"studentId" binding:"required"\`
		GDriveURL string \`json:"gdriveUrl" binding:"required"\`
		Note      string \`json:"note"\`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if !strings.Contains(req.GDriveURL, "drive.google.com") && !strings.Contains(req.GDriveURL, "docs.google.com") {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid URL. Please provide a valid Google Drive link."})
		return
	}

	submission := models.TaskSubmission{
		ID:          "sub-" + time.Now().Format("20060102150405"),
		TaskID:      req.TaskID,
		StudentID:   req.StudentID,
		GDriveURL:   req.GDriveURL,
		Note:        req.Note,
		SubmittedAt: time.Now(),
	}

	database.DB.Create(&submission)
	c.JSON(http.StatusCreated, submission)
}

// --- FORUM HANDLERS ---

func GetForumPosts(c *gin.Context) {
	classID := c.Query("classId")
	var posts []models.ForumPost
	query := database.DB.Preload("Author").Preload("Comments.Author")
	if classID != "" {
		query = query.Where("class_id = ?", classID)
	}
	query.Order("is_pinned desc, created_at desc").Find(&posts)

	c.JSON(http.StatusOK, posts)
}
`,
  },
  {
    filename: 'database/db.go',
    language: 'go',
    description: 'GORM Database connection manager with auto-migrations',
    code: `package database

import (
	"log"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"golang-lms-backend/models"
)

var DB *gorm.DB

func InitDB() {
	var err error
	DB, err = gorm.Open(sqlite.Open("lms_database.db"), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	log.Println("Database connection established. AutoMigrating schemas...")

	err = DB.AutoMigrate(
		&models.User{},
		&models.Class{},
		&models.StudyMaterial{},
		&models.Task{},
		&models.TaskSubmission{},
		&models.ForumPost{},
		&models.ForumComment{},
	)

	if err != nil {
		log.Fatalf("AutoMigration failed: %v", err)
	}

	log.Println("Database schemas updated successfully!")
}
`,
  },
  {
    filename: 'go.mod',
    language: 'go',
    description: 'Go module dependencies definitions',
    code: `module golang-lms-backend

go 1.22

require (
	github.com/gin-contrib/cors v1.7.0
	github.com/gin-gonic/gin v1.9.1
	gorm.io/driver/sqlite v1.5.5
	gorm.io/gorm v1.25.7
)
`,
  }
];
