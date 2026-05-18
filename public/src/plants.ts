import type { Plant } from "../../backend/src/types/plant";

const API_BASE = 'http://localhost:3000';

async function getPlants(): Promise<Plant[]> {
  try {
    const res = await fetch(`${API_BASE}/plants`);
    if (!res.ok) throw new Error('Failed to fetch plants');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function getPlant(id: number): Promise<Plant | null> {
  try {
    const res = await fetch(`${API_BASE}/plants/get/${id}`);
    if (!res.ok) throw new Error('Failed to fetch plant details');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

function displaySchedules(plant: Plant): string {
  if (!plant.schedules || plant.schedules.length === 0) {
    return '<p>No schedule available</p>';
  }

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  return plant.schedules
    .map(
      (s) => `
  <div class="schedule">
        <p>
          Plant: ${months[s.planting_start_month - 1]} - ${months[s.planting_end_month - 1]}<br>
          Harvest: ${months[s.harvest_start_month - 1]} - ${months[s.harvest_end_month - 1]}<br>
          ${s.notes || ''}
        </p>
      </div>
  `,
    )
    .join('');
}

function displayPlantDetails(plant: Plant): string {
  return `
    <p><strong>Description:</strong> ${plant.description}</p>
    <p><strong>Care:</strong> ${plant.care_instructions}</p>
    <p><strong>Sun:</strong> ${plant.sun_requirement}</p>
    <p><strong>Water:</strong> ${plant.water_requirement}</p>
    <p><strong>Soil type:</strong> ${plant.soil_type}</p>
    <p><strong>Blooming season:</strong> ${plant.blooming_season}</p>
    <p><strong>Difficulty level:</strong> ${plant.difficulty_level}</p>

    <h4>Planting Schedule</h4>
    ${displaySchedules(plant)}
  `;
}

function createPlantCard(plant: Plant): HTMLElement {
  const card = document.createElement('div');
  card.className = 'plantCard';

  const imgPath = `./assets/plants/${plant.img_url}`;

  card.innerHTML = `
    <img src="${imgPath}" width="150" alt="${plant.name}" />
    <h3>${plant.name}</h3>
    <p>${plant.latin_name || ''}</p>
    <button class="view-btn">View more</button>
    <button class="save-btn">
      <svg class="star-icon" width="20" height="20" viewBox="70 20 160 160" xmlns="http://www.w3.org/2000/svg">
        <polygon class="star-shape" points="150,20 170,80 230,80 185,120 205,180 150,150 95,180 115,120 70,80 130,80"
        fill="#ffffff"/>
      </svg>
    </button>
    <div class="details" style="display:none;"></div>
  `;

  const viewBtn = card.querySelector('.view-btn') as HTMLButtonElement;
  const detailsDiv = card.querySelector('.details') as HTMLDivElement;

  let isOpen = false;

  viewBtn.addEventListener('click', async () => {
    if (isOpen) {
      detailsDiv.style.display = 'none';
      detailsDiv.innerHTML = '';
      viewBtn.textContent = 'View more';
      isOpen = false;
    } else {
      const fullPlant = await getPlant(plant.id);
      console.log(fullPlant);
      if (!fullPlant) return;

      detailsDiv.innerHTML = displayPlantDetails(fullPlant);

      detailsDiv.style.display = 'block';

      viewBtn.textContent = 'Hide';
      isOpen = true;
    }
  });

  const saveBtn = card.querySelector('.save-btn') as HTMLButtonElement;
  const star = saveBtn.querySelector('.star-shape') as SVGPolygonElement;

  let isSaved = false;

  saveBtn.addEventListener('click', async (e) => {
    e.stopPropagation();

    isSaved = !isSaved;

    /*try {
      const res = await fetchWithAuth(
        "http://127.0.0.1:3000/api/user/save-plant",
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ plantId: plant.id }),
        },
        getAccessToken(),
      );

      if (!res.ok) throw new Error("Failed to save plant");*/
    if (isSaved) {
      star.setAttribute('fill', '#FFD800');
    } else {
      star.setAttribute('fill', '#ffffff');
    }

    /*} catch (err) {
      console.error(err);
    }*/
  });

  return card;
}

async function displayPlantList() {
  const container = document.getElementById('plantContainer') as HTMLDivElement;
  if (!container) {
    console.error('Plant container not found in HTML');
    return;
  }

  const plants = await getPlants();

  container.innerHTML = '';

  plants.forEach((plant) => {
    container.appendChild(createPlantCard(plant));
  });
}

async function searchPlants(query: string) {
  if (!query) return;

  const container = document.getElementById('plantContainer') as HTMLDivElement;
  if (!container) return;
  container.innerHTML = '';

  try {
    const res = await fetch(
      `${API_BASE}/plants/search?name=${encodeURIComponent(query)}`,
    );

    if (!res.ok) throw new Error('Network error');

    const plants: Plant[] = await res.json();

    if (plants.length === 0) {
      container.innerHTML = '<p>No plants found.</p>';
      return;
    }

    plants.forEach((plant) => container.appendChild(createPlantCard(plant)));
  } catch (err) {
    console.error('Error getting plants', err);
    container.innerHTML = '<p>Error getting plants.</p>';
  }
}

const searchIcon = document.getElementById('searchIcon') as HTMLImageElement;
const searchInput = document.getElementById('searchBar') as HTMLInputElement;

if (searchIcon && searchInput) {
  searchIcon.addEventListener('click', () => {
    searchInput.style.display =
      searchInput.style.display === 'block' ? 'none' : 'block';
    searchInput.focus();
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') searchPlants(searchInput.value.trim());
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const searchQuery = params.get('search');

  if (searchQuery && searchInput) {
    searchInput.value = searchQuery;
    searchPlants(searchQuery);
  } else {
    displayPlantList();
  }
});
