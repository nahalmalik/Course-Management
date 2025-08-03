import os
import re
import json
from django.core.management.base import BaseCommand
from courses.models import Course

class Command(BaseCommand):
    help = "Import course extra data from courseExtraData.js"

    def handle(self, *args, **kwargs):
        js_path = r"D:\Mentor craft\E_Learning Project\Project\Course-Management\mentor-craft\src\components\courseExtraData.js"

        if not os.path.exists(js_path):
            self.stdout.write(self.style.ERROR(f"❌ File not found: {js_path}"))
            return

        try:
            with open(js_path, "r", encoding="utf-8") as f:
                js_code = f.read()
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Error reading file: {e}"))
            return

        try:
            # Remove JS variable declaration and export line
            js_code = re.sub(r'^const\s+\w+\s*=\s*', '', js_code.strip(), flags=re.MULTILINE)
            js_code = re.sub(r'export\s+default\s+\w+;\s*$', '', js_code.strip(), flags=re.MULTILINE)

            # Remove outer semicolon and braces if any
            if js_code.endswith(';'):
                js_code = js_code[:-1]

            # Replace `backtick` strings with JSON-safe strings
            js_code = re.sub(r'`([^`]*)`', lambda m: json.dumps(m.group(1)), js_code, flags=re.DOTALL)

            # Quote numeric keys like 1: => "1":
            js_code = re.sub(r'(\s*)(\d+)\s*:', r'\1"\2":', js_code)

            # Quote all keys that aren't already quoted
            js_code = re.sub(r'([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:', r'\1"\2":', js_code)

            # Remove trailing commas before closing braces/brackets
            js_code = re.sub(r',(\s*[}\]])', r'\1', js_code)

            # Now parse to dict
            course_data = json.loads(js_code)

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Error during parsing: {e}"))
            return

        updated = 0
        for course_id_str, extra_data in course_data.items():
            try:
                course_id = int(course_id_str)
                course = Course.objects.get(id=course_id)

                course.overview = extra_data.get("overview", "")
                course.curriculum_intro = extra_data.get("curriculumIntro", "")
                course.curriculum = extra_data.get("curriculum", [])
                course.faqs = extra_data.get("faqs", [])
                course.save()
                updated += 1
            except Course.DoesNotExist:
                self.stdout.write(self.style.WARNING(f"⚠️ Course with id {course_id_str} not found."))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"❌ Failed to update course {course_id_str}: {e}"))

        self.stdout.write(self.style.SUCCESS(f"✅ Successfully updated {updated} courses."))
