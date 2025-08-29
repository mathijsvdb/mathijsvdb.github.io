(() => {
  const template = document.querySelector('template');

  function command(cmd, args) {
    const output = commands[cmd](args);
    if (output) {
      template.insertAdjacentHTML('beforebegin', `<p>${output}</p>`);
    }
  }

  document.addEventListener('keydown', (event) => {
    switch(event.key) {
      case 'Enter':
        try {
          event.preventDefault();

          const clone = template.content.cloneNode(true);
          clone.firstElementChild.lastElementChild.textContent = event.target.textContent;
          template.insertAdjacentElement('beforebegin', clone.firstElementChild);

          const [cmd, ...args] = event.target.textContent.split(' ');
          command(cmd, args);

          event.target.textContent = '';
          window.scrollTo(0, document.body.scrollHeight);
        } catch (error) {
          console.log(error.message);
          return;
        }
        break;
    }
  });

  const commands = {
    help: (args) => {
      return dedent`
        Available commands:
          echo [text] - Prints the text
          github      - Shows my github URL
          help        - Shows this help message
      `;
    },

    echo: (args) => {
      return args.join(' ');
    },

    github: () => {
      return `<a href="https://github.com/mathijsvdb" target="_blank" rel="noreferrer nofollow">github.com/mathijsvdb</a>`;
    }
  }

  function dedent(strings, ...values) {
    const fullString = strings.map((str, i) => str + (values[i] || '')).join('');

    // Remove leading/trailing newlines
    const lines = fullString.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n');

    // Find minimum indentation
    const indentLength = Math.min(
        ...lines.filter(line => line.trim()).map(line => line.match(/^(\s*)/)[0].length)
    );

    // Remove indentation
    return lines.map(line => line.slice(indentLength)).join('\n');
  }
})()

