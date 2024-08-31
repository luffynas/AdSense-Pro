const scrollPageDefault = async (page) => {
  await page.evaluate(async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const random = (min, max) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    const scrollStep = () => {
      return random(200, 600); // Panjang scroll yang acak
    };

    const scrollInterval = () => {
      return random(500, 1500); // Waktu antar scroll yang acak (500ms - 1500ms)
    };

    const scrollBehavior = async () => {
      let totalHeight = 0;
      while (totalHeight < document.body.scrollHeight) {
        const distance = scrollStep();
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= document.body.scrollHeight) break;

        await delay(scrollInterval());

        // Sesekali berhenti lebih lama seolah-olah sedang membaca
        if (Math.random() > 0.9) {
          await delay(random(2000, 5000)); // Berhenti membaca selama 2-5 detik
        }
      }
    };

    const scrollBackUp = async () => {
      let totalHeight = document.body.scrollHeight;
      while (totalHeight > 0) {
        const distance = -scrollStep();
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight <= 0) break;

        await delay(scrollInterval());

        // Sesekali berhenti lebih lama seolah-olah sedang membaca
        if (Math.random() > 0.9) {
          await delay(random(2000, 5000)); // Berhenti membaca selama 2-5 detik
        }
      }
    };

    await scrollBehavior();

    // Keputusan untuk menggulir kembali ke atas (misalnya 50% kemungkinan)
    if (Math.random() > 0.5) {
      await scrollBackUp();
    }
  });
};

const scrollScanner = async (page) => {
  await page.evaluate(async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const elements = document.querySelectorAll("h1, h2, h3, strong, li");

    for (let i = 0; i < elements.length; i++) {
      elements[i].scrollIntoView({ behavior: "smooth" });
      await delay(500 + Math.random() * 500); // Berhenti sebentar di setiap elemen
    }
  });
};

const scrollSkeptical = async (page) => {
  await page.evaluate(async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const paragraphs = document.querySelectorAll("p");

    for (let i = 0; i < paragraphs.length; i++) {
      paragraphs[i].scrollIntoView({ behavior: "smooth" });
      await delay(1000 + Math.random() * 2000); // Berhenti lebih lama untuk memverifikasi informasi
    }
  });
};

const scrollDeepDiver = async (page) => {
  await page.evaluate(async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const scrollStep = 100;
    let totalHeight = 0;

    while (totalHeight < document.body.scrollHeight) {
      window.scrollBy(0, scrollStep);
      totalHeight += scrollStep;
      await delay(1000 + Math.random() * 2000); // Scroll lambat dengan jeda panjang
    }
  });
};
const scrollSkimmer = async (page) => {
  await page.evaluate(async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    let totalHeight = 0;

    while (totalHeight < document.body.scrollHeight) {
      const step = Math.random() > 0.7 ? 300 : 50; // Scroll acak
      window.scrollBy(0, step);
      totalHeight += step;
      await delay(200 + Math.random() * 500); // Jeda singkat
    }
  });
};

const scrollOneTime = async (page) => {
  await page.evaluate(async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const scrollStep = 100;
    let totalHeight = 0;

    while (totalHeight < document.body.scrollHeight) {
      window.scrollBy(0, scrollStep);
      totalHeight += scrollStep;
      await delay(500 + Math.random() * 500); // Scroll stabil tanpa kembali
    }
  });
};

const scrollReReader = async (page) => {
  await page.evaluate(async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const scrollStep = 100;
    let totalHeight = 0;

    while (totalHeight < document.body.scrollHeight) {
      window.scrollBy(0, scrollStep);
      totalHeight += scrollStep;
      await delay(500 + Math.random() * 1000);

      if (Math.random() > 0.5) {
        window.scrollBy(0, -scrollStep * 2); // Menggulir kembali
        await delay(1000 + Math.random() * 2000);
      }
    }
  });
};

const scrollMultiTab = async (page) => {
  await page.evaluate(async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const scrollStep = 100;
    let totalHeight = 0;

    while (totalHeight < document.body.scrollHeight) {
      window.scrollBy(0, scrollStep);
      totalHeight += scrollStep;
      await delay(300 + Math.random() * 700);

      if (Math.random() > 0.8) {
        await delay(3000 + Math.random() * 3000); // Simulasi berpindah tab
      }
    }
  });
};

const scrollFomo = async (page) => {
  await page.evaluate(async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const scrollStep = 100;
    let totalHeight = 0;

    while (totalHeight < document.body.scrollHeight) {
      window.scrollBy(0, scrollStep);
      totalHeight += scrollStep;
      await delay(500 + Math.random() * 500); // Scroll lambat dengan perhatian penuh

      if (Math.random() > 0.9) {
        await delay(2000 + Math.random() * 3000); // Berhenti lebih lama
      }
    }
  });
};

const scrollImpulsive = async (page) => {
  await page.evaluate(async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const scrollStep = 100;
    let totalHeight = 0;

    while (totalHeight < document.body.scrollHeight) {
      window.scrollBy(0, scrollStep);
      totalHeight += scrollStep;
      await delay(200 + Math.random() * 500);

      if (Math.random() > 0.7) {
        break; // Berhenti secara impulsif setelah menemukan informasi
      }
    }
  });
};

const scrollInteractive = async (page) => {
  await page.evaluate(async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const elements = document.querySelectorAll("video, img, a");

    for (let i = 0; i < elements.length; i++) {
      elements[i].scrollIntoView({ behavior: "smooth" });
      await delay(1000 + Math.random() * 2000); // Berhenti lebih lama di elemen interaktif

      if (elements[i].tagName === "A") {
        // Simulasi klik pada tautan
        elements[i].click();
        break;
      }
    }
  });
};

const behaviors = [
  scrollPageDefault,
  scrollScanner,
  scrollSkeptical,
  scrollDeepDiver,
  scrollSkimmer,
  scrollOneTime,
  scrollReReader,
  scrollMultiTab,
  scrollFomo,
  scrollImpulsive,
  scrollInteractive,
];

const getRandomBehavior = () => {
  return behaviors[Math.floor(Math.random() * behaviors.length)];
};

export default getRandomBehavior;
