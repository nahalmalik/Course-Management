import json
import re
from django.core.management.base import BaseCommand
from users.models import CustomUser

class Command(BaseCommand):
    help = 'Import instructor data from instructorData.js into CustomUser model'

    def handle(self, *args, **kwargs):
        # ✅ Replace with correct path to your instructorData.js
        js_file_path = r'D:\Mentor craft\E_Learning Project\Project\Course-Management\mentor-craft\src\components\instructorData.js'

        try:
            with open(js_file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # ✅ Extract the instructorData array using regex
            match = re.search(r'const instructorData\s*=\s*(\[\s*[\s\S]*?\]);', content)
            if not match:
                self.stderr.write(self.style.ERROR("❌ Could not find 'instructorData' array in the file."))
                return

            raw_array_str = match.group(1)

            # ✅ Clean and convert JS-style to JSON
            def quote_keys(text):
                return re.sub(r'(?<=\{|,)\s*(\w+)\s*:', r'"\1":', text)

            json_like = raw_array_str
            json_like = quote_keys(json_like)
            json_like = json_like.replace("'", '"')
            json_like = json_like.replace('None', 'null')
            json_like = json_like.replace('True', 'true')
            json_like = json_like.replace('False', 'false')

# Remove trailing commas before closing braces/brackets
            json_like = re.sub(r',\s*(\}|\])', r'\1', json_like)


            try:
                instructors = json.loads(json_like)
            except json.JSONDecodeError as e:
                self.stderr.write(self.style.ERROR(f"❌ JSON parse error: {e}"))
                return

            # ✅ Import instructors
            created, skipped = 0, 0
            for instructor in instructors:
                email = instructor.get('email')
                password = instructor.get('password', '123456')
                username = instructor.get('name')

                if CustomUser.objects.filter(email=email).exists():
                    skipped += 1
                    continue

                CustomUser.objects.create_user(
                    email=email,
                    password=password,
                    role='instructor',
                    username=username or email.split('@')[0]
                )
                created += 1

            self.stdout.write(self.style.SUCCESS(f"✅ Imported {created} instructors. Skipped {skipped} existing ones."))

        except Exception as e:
            self.stderr.write(self.style.ERROR(f"❌ Error: {e}"))
