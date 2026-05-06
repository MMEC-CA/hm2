import { LURES, CAT_BREEDS } from './constants.js';

class NekoGarden {
  constructor() {
    this.fish = parseInt(localStorage.getItem('neko_fish')) || 100;
    this.activeLures = JSON.parse(localStorage.getItem('neko_lures')) || {};
    this.currentCats = [];
    this.collectedCats = JSON.parse(localStorage.getItem('neko_collected')) || [];
    this.selectedLureId = null;

    this.initElements();
    this.render();
    this.startAttractionLoop();
    this.showNotification('Welcome to Neko Garden!');
  }

  initElements() {
    this.fishDisplay = document.getElementById('fish-count');
    this.garden = document.getElementById('garden');
    this.inventory = document.getElementById('inventory');
    this.slots = document.querySelectorAll('.slot');
    this.catbookBtn = document.getElementById('catbook-btn');
    this.modal = document.getElementById('modal');
    this.modalContent = document.getElementById('modal-body');
    this.closeModal = document.querySelector('.close');

    this.slots.forEach(slot => {
      slot.addEventListener('click', () => this.placeLure(slot.dataset.id));
    });

    this.catbookBtn.addEventListener('click', () => this.openCatbook());
    this.closeModal.addEventListener('click', () => this.modal.style.display = 'none');
    window.addEventListener('click', (e) => { if (e.target == this.modal) this.modal.style.display = 'none'; });

    this.initInventory();
  }

  showNotification(text) {
    const note = document.createElement('div');
    note.className = 'notification';
    note.innerText = text;
    document.body.appendChild(note);
    setTimeout(() => note.classList.add('show'), 100);
    setTimeout(() => {
      note.classList.remove('show');
      setTimeout(() => note.remove(), 500);
    }, 3000);
  }

  openCatbook() {
    this.modal.style.display = 'block';
    this.modalContent.innerHTML = '<h2>Catbook</h2><div class="catbook-grid"></div>';
    const grid = this.modalContent.querySelector('.catbook-grid');

    CAT_BREEDS.forEach(breed => {
      const isCollected = this.collectedCats.includes(breed.id);
      const item = document.createElement('div');
      item.className = `catbook-item ${isCollected ? '' : 'locked'}`;
      item.innerHTML = `
        <div class="cat-preview">${isCollected ? '🐱' : '❓'}</div>
        <div class="cat-name">${isCollected ? breed.name : '???'}</div>
      `;
      grid.appendChild(item);
    });
  }

  initInventory() {
    this.inventory.innerHTML = '';
    LURES.forEach(lure => {
      const item = document.createElement('div');
      item.className = `inv-item ${this.selectedLureId === lure.id ? 'selected' : ''}`;
      item.innerHTML = `
        <div>${this.getLureEmoji(lure.id)}</div>
        <div>${lure.cost}🐟</div>
      `;
      item.addEventListener('click', () => {
        this.selectedLureId = lure.id;
        this.initInventory();
      });
      this.inventory.appendChild(item);
    });
  }

  getLureEmoji(id) {
    const emojis = {
      thrifty_bitz: '🥣',
      frisky_bitz: '🥫',
      rubber_ball: '🎾',
      cardboard_box: '📦'
    };
    return emojis[id] || '❓';
  }

  placeLure(slotId) {
    if (!this.selectedLureId) return;
    
    const lure = LURES.find(l => l.id === this.selectedLureId);
    if (this.fish < lure.cost) {
      alert('Not enough fish!');
      return;
    }

    this.fish -= lure.cost;
    this.activeLures[slotId] = this.selectedLureId;
    this.save();
    this.render();
  }

  startAttractionLoop() {
    setInterval(() => {
      this.checkAttractions();
    }, 5000); // Check every 5 seconds
  }

  checkAttractions() {
    // Basic logic for now: if a slot has a lure and is empty of cats, try to spawn
    Object.keys(this.activeLures).forEach(slotId => {
      const lureId = this.activeLures[slotId];
      const lure = LURES.find(l => l.id === lureId);
      
      if (Math.random() < lure.attractionRate && !this.currentCats.some(c => c.slotId === slotId)) {
        this.spawnCat(slotId);
      }
    });
  }

  spawnCat(slotId) {
    const breed = CAT_BREEDS[Math.floor(Math.random() * CAT_BREEDS.length)];
    const cat = {
      id: Date.now(),
      breedId: breed.id,
      slotId: slotId,
      startTime: Date.now()
    };
    this.currentCats.push(cat);
    
    if (!this.collectedCats.includes(breed.id)) {
      this.collectedCats.push(breed.id);
      this.showNotification(`A new cat visited: ${breed.name}!`);
    } else {
      this.showNotification(`${breed.name} is here!`);
    }
    
    this.save();
    this.renderCats();
  }

  renderCats() {
    // Clear old cats
    const existingCats = this.garden.querySelectorAll('.cat');
    existingCats.forEach(c => c.remove());

    this.currentCats.forEach(cat => {
      const breed = CAT_BREEDS.find(b => b.id === cat.breedId);
      const slot = document.querySelector(`.slot[data-id="${cat.slotId}"]`);
      if (!slot) return;

      const catEl = document.createElement('div');
      catEl.className = 'cat';
      catEl.style.left = `${parseInt(slot.style.left) + 10}px`;
      catEl.style.top = `${parseInt(slot.style.top) - 20}px`;
      
      const patchHTML = breed.patches.map((p, i) => `
        <div class="cat-patch" style="background: ${p}; width: ${15 + i*5}px; height: ${10 + i*5}px; border-radius: 50%; position: absolute; top: ${5+i*5}px; left: ${5+i*2}px; opacity: 0.8;"></div>
      `).join('');

      catEl.innerHTML = `
        <div class="cat-tail" style="background: ${breed.colors.body}"></div>
        <div class="cat-body" style="background: ${breed.colors.body}">
          ${patchHTML}
        </div>
        <div class="cat-head" style="background: ${breed.colors.body}">
          <div class="cat-ear left" style="border-bottom-color: ${breed.colors.body}"></div>
          <div class="cat-ear right" style="border-bottom-color: ${breed.colors.body}"></div>
          <div class="cat-eyes">
            <div class="cat-eye left"></div>
            <div class="cat-eye right"></div>
          </div>
          <div class="cat-nose"></div>
        </div>
      `;

      catEl.addEventListener('click', () => this.collectFish(cat.id));
      this.garden.appendChild(catEl);
    });
  }

  collectFish(catId) {
    const index = this.currentCats.findIndex(c => c.id === catId);
    if (index === -1) return;

    const reward = Math.floor(Math.random() * 20) + 10;
    this.fish += reward;
    this.currentCats.splice(index, 1);
    this.save();
    this.render();
  }

  save() {
    localStorage.setItem('neko_fish', this.fish);
    localStorage.setItem('neko_lures', JSON.stringify(this.activeLures));
    localStorage.setItem('neko_collected', JSON.stringify(this.collectedCats));
  }

  render() {
    this.fishDisplay.innerText = this.fish;
    
    // Render lures in slots
    this.slots.forEach(slot => {
      const slotId = slot.dataset.id;
      const lureId = this.activeLures[slotId];
      if (lureId) {
        slot.classList.add('occupied');
        slot.innerHTML = `<span class="lure-item">${this.getLureEmoji(lureId)}</span>`;
      } else {
        slot.classList.remove('occupied');
        slot.innerHTML = '';
      }
    });

    this.renderCats();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new NekoGarden();
});
