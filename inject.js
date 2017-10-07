(function() {
  const assignees = [];
  Array.from(document.querySelectorAll('.ghx-issue img[data-tooltip^="Assignee: "]')).forEach((el) => {
    const name = el.dataset.tooltip.replace(/^Assignee: /, '');
    if (!assignees.find(a => a.name === name)) {
      const assignee = {
        name,
        avatar: el.src,
      };
      assignees.push(assignee);
    }
  });
  const toolbar = document.getElementById('ghx-controls-work');
  if (toolbar && assignees.length) {
    let currentlySelectedAssigneeName;

    // add container
    const dl = document.createElement('dl');
    dl.className = 'ghx-controls-filters';
    toolbar.appendChild(dl);

    assignees
      // sort alphabetically by name
      .sort((a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0))

      // add toggler buttons
      .forEach(assignee => {
        const dd = document.createElement('dd');

        const a = document.createElement('a');
        a.role = 'button';
        a.href = '#';
        a.className = 'js-quickfilter-button';
        a.title = assignee.name;
        a.style.padding = 0;
        a.dataset.assignee = assignee.name;

        const img = document.createElement('img');
        img.className = 'ghx-avatar-img';
        img.src = assignee.avatar;
        img.alt = assignee.name;
        img.onclick = () => {
          // toggle issue visibility
          Array.from(document.querySelectorAll('.ghx-issue')).forEach((el) => {
            if (currentlySelectedAssigneeName === assignee.name || el.querySelector(`img[data-tooltip="Assignee: ${assignee.name}"]`)) {
              // show all issues, or
              // issue is assigned to this assignee
              el.classList.remove('hidden');
            } else {
              el.classList.add('hidden');
            }
          });
          // toggle button active states
          Array.from(dl.querySelectorAll(`a[data-assignee]`)).forEach((el) => {
            if (currentlySelectedAssigneeName === assignee.name || el.dataset.assignee !== assignee.name) {
              el.classList.remove('ghx-active');
            } else {
              el.classList.add('ghx-active');
            }
          });

          // store for 'un-toggling'
          currentlySelectedAssigneeName = currentlySelectedAssigneeName === assignee.name ? null : assignee.name;
        };

        // inject into UI
        a.appendChild(img);
        dd.appendChild(a);
        dl.appendChild(dd);
      });
  }
})();