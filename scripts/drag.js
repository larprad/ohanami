let dragged;
let dropbox;

document.addEventListener('drag', function (event) {}, false);

document.addEventListener('dragstart', function (event) {
  dragged = event.target;
  dragged.style.opacity = '0.1';
  document.getElementById('space_player_cards').style.opacity = 0.7;
  player_card_selected ? unselectPlayerCard(player_card_selected.card_id) : null;
  !gamePause ? selectPlayerCard(dragged.id) : console.log("You can't drag this card");
});

document.addEventListener('dragend', function (event) {
  dragged = event.target;
  dragged.style.opacity = '1';
  document.getElementById('space_player_cards').style.opacity = 1;
  player_card_selected ? unselectPlayerCard(player_card_selected.card_id) : null;
  !gamePause & dragged.id ? unselectPlayerCard(dragged.id) : null;
  dropbox.style.border = 'none';
});

document.addEventListener('dragenter', function (event) {
  dropbox = event.target;
  if (dropbox.className.includes('drop')) {
    dropbox.className.includes('gard_')
      ? (dropbox.parentElement.style.transform = 'scale(1.05)')
      : (dropbox.style.transform = 'scale(1.05)');
  } else {
    null;
  }
});

document.addEventListener('dragleave', function (event) {
  dropbox = event.target;
  if (dropbox.className.includes('drop')) {
    dropbox.className.includes('gard_')
      ? (dropbox.parentElement.style.transform = 'scale(1)')
      : (dropbox.style.transform = 'scale(1)');
  } else {
    null;
  }
});

document.addEventListener('dragover', function (event) {
  event.preventDefault();
});

document.addEventListener('drop', function (event) {
  // event.preventDefault();
  dropbox = event.target;
  if (player_card_selected) {
    if (dropbox.className.includes('drop') & dropbox.className.includes('trash')) {
      discardCard(player_card_selected, 'trash_p');
      endTurn();
      endSet();
      dropbox.style.border = 'none';
    } else if (dropbox.className.includes('drop')) {
      if (dropbox.id.includes('gard_p')) {
        displayCardOnGarden(dropbox.id, player_card_selected);
      } else {
        dropbox.className.includes('0')
          ? displayCardOnGarden('gard_p_0', player_card_selected)
          : null;
        dropbox.className.includes('1')
          ? displayCardOnGarden('gard_p_1', player_card_selected)
          : null;
        dropbox.className.includes('2')
          ? displayCardOnGarden('gard_p_2', player_card_selected)
          : null;
      }
      endTurn();
      endSet();
    } else {
      null;
    }
    if (dropbox.className.includes('drop')) {
      dropbox.className.includes('gard_')
        ? (dropbox.parentElement.style.transform = 'scale(1)')
        : (dropbox.style.transform = 'scale(1)');
    } else {
      null;
    }
    document.getElementById('space_player_cards').style.opacity = 1;
  } else {
    null;
  }
});
