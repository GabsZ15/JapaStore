import re

with open('src/types.ts', 'r') as f:
    content = f.read()

# Add to interface
interface_target = "  footer: {\n    aboutText: string;\n  };"
interface_replacement = """  heroBanners: {
    banner1: string;
    banner2: string;
  };
  footer: {
    aboutText: string;
  };"""
content = content.replace(interface_target, interface_replacement)

# Add to default
default_target = "  footer: {\n    aboutText: \"Streetwear e moda casual para quem busca atitude e minimalismo. O melhor do design contemporâneo focado em qualidade e exclusividade.\"\n  },"
default_replacement = """  heroBanners: {
    banner1: '/images/japastorebanner1.jpeg',
    banner2: '/images/japastorebanner2.jpeg'
  },
  footer: {
    aboutText: "Streetwear e moda casual para quem busca atitude e minimalismo. O melhor do design contemporâneo focado em qualidade e exclusividade."
  },"""
content = content.replace(default_target, default_replacement)

with open('src/types.ts', 'w') as f:
    f.write(content)
