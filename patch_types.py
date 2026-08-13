import re

with open('src/types.ts', 'r') as f:
    content = f.read()

target = """  homeCategories: {
    items: [
      {
        id: "moletons",
        title: "Moletons",
        imageUrl: "/images/Moletom.jpeg",
        linkTo: "/moletons"
      },
      {
        id: "camisetas",
        title: "Camisetas",
        imageUrl: "/images/Camiseta.jpeg",
        linkTo: "/camisetas"
      },
      {
        id: "bermudas",
        title: "Bermudas",
        imageUrl: "/images/Bermuda.jpeg",
        linkTo: "/bermudas"
      }
    ]
  },"""

replacement = """  homeCategories: {
    items: [
      {
        id: "camisetas",
        title: "Camisetas",
        imageUrl: "/images/Camiseta.jpeg",
        linkTo: "/camisetas"
      },
      {
        id: "bermudas",
        title: "Bermudas",
        imageUrl: "/images/Bermuda.jpeg",
        linkTo: "/bermudas"
      },
      {
        id: "moletons",
        title: "Moletons",
        imageUrl: "/images/Moletom.jpeg",
        linkTo: "/moletons"
      }
    ]
  },"""

content = content.replace(target, replacement)

with open('src/types.ts', 'w') as f:
    f.write(content)
