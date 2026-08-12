import re

with open('src/contexts/SettingsContext.tsx', 'r') as f:
    content = f.read()

target = "const mergedSiteContent = dbSiteContent ? { ...defaultSiteContent, ...dbSiteContent } : defaultSiteContent;"

replacement = """
        const mergedSiteContent = dbSiteContent ? { 
          ...defaultSiteContent, 
          ...dbSiteContent,
          pages: {
            ...defaultSiteContent.pages,
            ...(dbSiteContent.pages || {})
          },
          homeCategories: {
            ...defaultSiteContent.homeCategories,
            ...(dbSiteContent.homeCategories || {})
          }
        } : defaultSiteContent;
"""

content = content.replace(target, replacement)

with open('src/contexts/SettingsContext.tsx', 'w') as f:
    f.write(content)
