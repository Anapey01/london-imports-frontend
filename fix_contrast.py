import os
import re

# Paths to process
src_dir = r"c:\Users\user\Desktop\Naa\frontend\src"

# Regex patterns and replacements
replacements = [
    # Backgrounds
    (re.compile(r'bg-emerald-600(\s+text-white|.*?text-white|.*?)'), r'bg-emerald-700\1'),
    # Note: the above regex might be too simple, let's just do direct replacements for common ones.
]

direct_replacements = {
    'bg-emerald-600 text-white': 'bg-emerald-700 text-white',
    'bg-emerald-600': 'bg-emerald-700',
    'text-emerald-600 hover:text-emerald-500': 'text-emerald-700 dark:text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400',
    'text-emerald-600': 'text-emerald-700 dark:text-emerald-500',
    'text-content-secondary/40': 'text-content-secondary/70 dark:text-content-secondary/60',
    'text-content-secondary/60': 'text-content-secondary/80 dark:text-content-secondary/70',
    'text-content-secondary/30': 'text-content-secondary/60 dark:text-content-secondary/50',
    'text-content-secondary/20': 'text-content-secondary/50 dark:text-content-secondary/40',
}

files_changed = 0

for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Since some replacements might overlap, order matters. 
            # We want to make sure we don't double replace.
            # bg-emerald-600 text-white -> bg-emerald-700 text-white
            content = content.replace('bg-emerald-600 text-white', 'bg-emerald-700 text-white')
            content = content.replace('bg-emerald-600', 'bg-emerald-700')
            
            content = content.replace('text-emerald-600 hover:text-emerald-500', 'text-emerald-700 dark:text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400')
            content = content.replace('text-emerald-600', 'text-emerald-700 dark:text-emerald-500')
            
            content = content.replace('text-content-secondary/40', 'text-content-secondary/70 dark:text-content-secondary/60')
            content = content.replace('text-content-secondary/60', 'text-content-secondary/80 dark:text-content-secondary/70')
            content = content.replace('text-content-secondary/30', 'text-content-secondary/60 dark:text-content-secondary/50')
            content = content.replace('text-content-secondary/20', 'text-content-secondary/50 dark:text-content-secondary/40')
            
            # Clean up potential double replacements
            content = content.replace('bg-emerald-700 text-white text-white', 'bg-emerald-700 text-white')
            content = content.replace('text-emerald-700 dark:text-emerald-500 dark:text-emerald-500', 'text-emerald-700 dark:text-emerald-500')
            content = content.replace('bg-emerald-7000', 'bg-emerald-700')
            
            if content != original_content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated {path}")
                files_changed += 1

print(f"\nTotal files updated: {files_changed}")
