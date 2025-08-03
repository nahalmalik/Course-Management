import json
import re
from django.core.management.base import BaseCommand
from users.models import CustomUser

class Command(BaseCommand):
    help = 'Import student data from studentData.js into CustomUser model'

    def handle(self, *args, **kwargs):
        # ✅ Update this to your real path:
        js_file_path = r'D:\Mentor craft\E_Learning Project\Project\Course-Management\mentor-craft\src\contexts\studentData.js'

        try:
            with open(js_file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # ✅ Extract the rawData array using regex
            match = re.search(r'const rawData\s*=\s*(\[\s*[\s\S]*?\]);', content)
            if not match:
                self.stderr.write(self.style.ERROR("❌ Could not find 'rawData' array in the file."))
                return

            raw_array_str = match.group(1)

            # ✅ Fix JavaScript-style keys: quote property names
            def quote_keys(text):
                return re.sub(r'(?<=\{|,)\s*(\w+)\s*:', r'"\1":', text)

            json_like = raw_array_str
            json_like = quote_keys(json_like)
            json_like = json_like.replace("'", '"')
            json_like = json_like.replace('None', 'null')
            json_like = json_like.replace('True', 'true')
            json_like = json_like.replace('False', 'false')

            try:
                students = json.loads(json_like)
            except json.JSONDecodeError as e:
                self.stderr.write(self.style.ERROR(f"❌ JSON parse error: {e}"))
                return

            # ✅ Import students into DB
            created, skipped = 0, 0
            for student in students:
                email = student.get('email')
                password = student.get('password', '123456')
                username = student.get('name')

                if CustomUser.objects.filter(email=email).exists():
                    skipped += 1
                    continue

                CustomUser.objects.create_user(
                    email=email,
                    password=password,
                    role='student',
                    username=username or email.split('@')[0]
                )
                created += 1

            self.stdout.write(self.style.SUCCESS(f"✅ Imported {created} students. Skipped {skipped} existing ones."))

        except Exception as e:
            self.stderr.write(self.style.ERROR(f"❌ Error: {e}"))
