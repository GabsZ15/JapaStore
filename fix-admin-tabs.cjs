const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminPage.tsx', 'utf8');

const contentTabCode = `            <button 
              onClick={() => setActiveTab('content')}
              className={\`flex items-center gap-2 px-4 py-3 font-bold uppercase tracking-wider text-xs transition-colors \${
                activeTab === 'content' 
                  ? 'border-b-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white' 
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }\`}
            >
              <Edit className="h-4 w-4" />
              Conteúdo
            </button>`;

code = code.replace(contentTabCode, '');

fs.writeFileSync('src/pages/AdminPage.tsx', code);
