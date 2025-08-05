
import os
#import django
import firebase_admin
from firebase_admin import credentials, firestore
from django.conf import settings
from django.utils.timezone import now

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mentorcraft.settings')
#django.setup()

from courses.models import Course

# Initialize Firebase Admin
if not firebase_admin._apps:
    # 🔥 Use absolute path instead of BASE_DIR
    cred_path = r"D:\Mentor craft\E_Learning Project\Project\Course-Management\mentorcraft-backend\mentorcraft\firebase_sync\firebase_config.json"
    cred = credentials.Certificate(cred_path)

    firebase_admin.initialize_app(cred)

db = firestore.client()

def get_image_url(image_field):
    try:
        return image_field.url if image_field else ''
    except:
        return ''

def sync_courses_to_firebase():
    courses = Course.objects.all()
    for course in courses:
        firebase_data = {
            'id': str(course.course_id),
            'title': course.title,
            'description': course.description,
            'category': course.category,
            'level': course.level,
            'price': float(course.price),
            'imageUrl': get_image_url(course.image),
            'teacherName': getattr(course, 'instructor', None),
            'teacherId': course.instructor_email,
            'rating': float(course.rating or 0),
            'enrolledStudents': int(course.students or 0),
            'modules': course.curriculum if hasattr(course, 'curriculum') else [],
            'createdAt': now().isoformat()
        }
        doc_ref = db.collection('courses').document(str(course.course_id))
        doc_ref.set(firebase_data)
        print(f"Synced course: {course.title}")

if __name__ == "__main__":
    sync_courses_to_firebase()


# Inside sync_courses_to_firebase.py
def sync_single_course(course):
    firebase_data = {
        'id': str(course.course_id),
        'title': course.title,
        'description': course.description,
        'category': course.category,
        'level': course.level,
        'price': float(course.price),
        'imageUrl': get_image_url(course.image),
        'teacherName': getattr(course, 'instructor', None),
        'teacherId': course.instructor_email,
        'rating': float(course.rating or 0),
        'enrolledStudents': int(course.students or 0),
        'modules': course.curriculum if hasattr(course, 'curriculum') else [],
        'createdAt': now().isoformat()
    }
    doc_ref = db.collection('courses').document(str(course.course_id))
    doc_ref.set(firebase_data)
    print(f"✅ Synced course: {course.title}")
