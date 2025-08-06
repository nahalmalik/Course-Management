from firebase_admin import firestore
from firebase_sync.firebase_init import firebase_app  # ensures Firebase is initialized
from courses.models import Course  # adjust path if different
from django.utils import timezone

db = firestore.client()

def sync_firebase_courses_to_django():
    courses_ref = db.collection('courses')  # use your Firestore collection name
    docs = courses_ref.stream()

    for doc in docs:
        data = doc.to_dict()

        course_id = data.get("id")
        title = data.get("title")
        description = data.get("description")
        price = data.get("price")
        instructor_email = data.get("instructor_email")

        if not title or not instructor_email:
            continue  # skip incomplete data

        # 🔁 Create or update the course
        course, created = Course.objects.update_or_create(
            id=course_id,
            defaults={
                "title": title,
                "description": description,
                "price": price,
                "updated_at": timezone.now(),
                # add other fields here
            }
        )

        print(f"{'Created' if created else 'Updated'} → {title}")
