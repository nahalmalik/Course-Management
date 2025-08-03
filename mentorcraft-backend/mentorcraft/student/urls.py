from django.urls import path
from .views import EnrolledCoursesView
from .views import (
    # Profile & Notifications
    StudentProfileView,
    NotificationListView,
    StudentNotificationListView,
    InstructorNotificationListView,

    # Reviews
    ReviewListCreateView,
    InstructorReviewListView,
    InstructorReplyView,

    # Assignments
    AssignmentSubmissionCreateView,
    StudentAssignmentListView,

    # Quizzes
    AvailableQuizListView,
    QuizAttemptCreateView,
    QuizAttemptListView,
    SubmittedQuizAttemptListView,

    #StudentDiscussion
    StudentDiscussionListCreateView,
)

urlpatterns = [
    path('courses/enrolled/', EnrolledCoursesView, name='enrolled-courses'),
    # ──────── Profile ────────
    path('profile/', StudentProfileView.as_view(), name='student-profile'),

    # ──────── Reviews ────────
    path('reviews/', ReviewListCreateView.as_view(), name='student-reviews'),
    path('reviews/reply/', InstructorReplyView.as_view(), name='instructor-reply'),
    path('instructor/reviews/', InstructorReviewListView.as_view(), name='instructor-reviews'),

    # ──────── Notifications ────────
    path('notifications/', NotificationListView.as_view(), name='user-notifications'),
    path('notifications/student/', StudentNotificationListView.as_view(), name='student-notifications'),
    path('notifications/instructor/', InstructorNotificationListView.as_view(), name='instructor-notifications'),

    # ──────── Assignments ────────
    path('assignments/', StudentAssignmentListView.as_view(), name='student-assignments'),
    path('submit-assignment/', AssignmentSubmissionCreateView.as_view(), name='submit-assignment'),

    # ──────── Quizzes ────────
    path('available-quizzes/', AvailableQuizListView.as_view(), name='available-quizzes'),
    path('submit-quiz/', QuizAttemptCreateView.as_view(), name='submit-quiz'),
    path('quiz-attempts/', QuizAttemptListView.as_view(), name='student-quiz-attempts'),
    path('submitted-quizzes/', SubmittedQuizAttemptListView.as_view(), name='submitted-quizzes'),

    # ──────── Student Discussion ────────
    path('discussions/', StudentDiscussionListCreateView.as_view(), name='student-discussions'),
]
