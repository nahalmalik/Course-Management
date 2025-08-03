import os
import re
import json
from decimal import Decimal
from django.core.management.base import BaseCommand
from courses.models import Course


class Command(BaseCommand):
    help = "Imports course data from courseData.js into the Course model"

    def handle(self, *args, **options):
        js_file_path = r"D:\Mentor craft\E_Learning Project\Project\Course-Management\mentor-craft\src\components\courseData.js"

        if not os.path.exists(js_file_path):
            self.stderr.write(f"❌ File not found: {js_file_path}")
            return

        try:
            with open(js_file_path, "r", encoding="utf-8") as f:
                content = f.read()

            # ✅ Step 1: Remove all import lines
            content = re.sub(r'^import .*?;\s*', '', content, flags=re.MULTILINE)

            # ✅ Step 2: Remove image assignments (we will ignore images)
            content = re.sub(r'image:\s*[^,]+,', 'image: "",', content)

            # ✅ Step 3: Extract the course array
            match = re.search(r'const courseData\s*=\s*(\[[\s\S]+?\]);', content)
            if not match:
                self.stderr.write("❌ Could not find courseData array.")
                return

            js_array = match.group(1)

            # ✅ Step 4: Convert JS-like syntax → JSON-safe
            js_array = js_array.replace("'", '"')  # convert single to double quotes
            js_array = re.sub(r'(\w+):', r'"\1":', js_array)  # quote keys
            js_array = re.sub(r',\s*([}\]])', r'\1', js_array)  # remove trailing commas

            # ✅ Step 5: Parse with json
            data = json.loads(js_array)

            # ✅ Step 6: Save to DB
            imported = 0
            skipped = 0

            for item in data:
                title = item.get("title")
                instructor_email = item.get("instructorEmail")
                price_str = str(item.get("price", "0")).replace("$", "").strip()
                price = Decimal("0.00") if price_str.lower() == "free" else Decimal(price_str)

                if Course.objects.filter(title=title, instructor_email=instructor_email).exists():
                    skipped += 1
                    continue

                Course.objects.create(
                    title=title,
                    description="",
                    category=item.get("category", ""),
                    level="Beginner",
                    language="English",
                    price=price,
                    lessons=item.get("lessons", 0),
                    duration=item.get("duration", ""),
                    instructor=item.get("instructor", ""),
                    instructor_email=instructor_email,
                    rating=float(item.get("rating", 4.5)),
                    students=0,
                )
                imported += 1

            self.stdout.write(self.style.SUCCESS(f"✅ Imported {imported} courses. Skipped {skipped} duplicates."))

        except Exception as e:
            self.stderr.write(f"❌ Error during import: {e}")
