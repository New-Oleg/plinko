import { Application, Assets, Sprite, Container, Text, TextStyle, Graphics } from "pixi.js";
import * as PIXI from 'pixi.js';
import { IMAGE_DATA } from './imageData.js';
import { AUDIO_DATA } from './AudioDAta.js';
import { sdk } from '@smoud/playable-sdk';

// Оборачиваем код в DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const app = new Application();
    
    // Переменные для хранения элементов
    let pixiContainer, gameContainer, bg, play, field, balanceText;
    let ballsArray = [];
    const ballPaths = [];
    const ballStates = [];

    // UI элементы
    let uiPanel, uiHidder, betText;
    
    // Спрайты множителей
    let multiplierSprites = [];
    const multiplierFiles = ['x50.png', 'x10.png', 'x5.png', 'x2.png', 'x1.png'];
    const multiplierOrder = [0, 1, 2, 3, 4, 3, 2, 1, 0];
    
    // Элемент руки для подсказки
    let handSprite = null;
    let isFirstClick = false;
    
    // Анимация кнопки play
    let isButtonAnimating = false;
    const BUTTON_ANIMATION_DURATION = 150; // Длительность анимации в мс
    
    // Состояние ориентации
    let isPortrait = true;
    let isSquare = false; // Флаг квадратного разрешения
    let screenRatio = 1; // Соотношение сторон экрана
    
    // Переменные для управления пэкшотом
    let isPackshotActive = false;
    let packshotOverlay = null;
    let packshotLayer = null;
    let currentPackshotStage = 'initial';
    let packshotElements = {};
    
    // Система анимации корзинок
    const basketAnimations = new Map();
    const BASKET_ANIMATION_DURATION = 400;
    const BASKET_BOUNCE_HEIGHT = 30;
    
    // Маппинг шаров на корзинки
    const ballToBasketMapping = [
      4, 4, 5, 2, 2, 6, 2, 4, 2, 1
    ];
    
    let currentBalance = 200;
    let displayedBalance = 200;
    let balanceAnimation = {
        active: false,
        startTime: 0,
        startValue: 200,
        targetValue: 200
    };
    const BALANCE_ANIMATION_DURATION = 1000;

    // Аудио элементы
    let audioContext;
    let sounds = {
      bigWin: null,
      buttonClick: null,
      balanceChange: null,
      magicalWin: null
    };

    // Флаг включения/выключения звука (всегда ВЫКЛЮЧЕН)
    let isSoundOn = false;

    // Disclaimer текст (будет виден всегда)
    let disclaimerText = null;

    // Функция инициализации аудио (закомментирована)
    function initAudio() {
      /*
      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Загружаем звуки из base64 данных
        loadSoundFromBase64('bigWin', AUDIO_DATA.bigWin);
        loadSoundFromBase64('buttonClick', AUDIO_DATA.buttonClick);
        loadSoundFromBase64('balanceChange', AUDIO_DATA.balanceChange);
        loadSoundFromBase64('magicalWin', AUDIO_DATA.magicalWin);
        
        console.log('🎵 Аудио система инициализирована (base64)');
      } catch (error) {
        console.error('❌ Ошибка инициализации аудио:', error);
        Object.keys(sounds).forEach(key => {
          sounds[key] = createDummySound();
        });
      }
      */
    }

    // Функция загрузки звука из base64 (закомментирована)
    function loadSoundFromBase64(soundName, base64Data) {
      /*
      return new Promise((resolve) => {
        try {
          if (!base64Data || base64Data.trim() === '') {
            console.warn(`⚠️ Пустая base64 строка для звука ${soundName}`);
            sounds[soundName] = createDummySound();
            resolve(sounds[soundName]);
            return;
          }
          
          let fullBase64 = base64Data;
          if (!fullBase64.startsWith('data:audio/')) {
            fullBase64 = `data:audio/mp3;base64,${fullBase64}`;
          }
          
          const audio = new Audio();
          
          audio.addEventListener('canplaythrough', () => {
            console.log(`✅ Звук загружен из base64: ${soundName}`);
            sounds[soundName] = audio;
            resolve(audio);
          }, { once: true });
          
          audio.addEventListener('error', (error) => {
            console.error(`❌ Ошибка загрузки звука ${soundName} из base64:`, error);
            sounds[soundName] = createDummySound();
            resolve(sounds[soundName]);
          }, { once: true });
          
          audio.src = fullBase64;
          audio.preload = 'auto';
          
          const playPromise = audio.load();
          
          if (playPromise && playPromise.catch) {
            playPromise.catch(error => {
              console.warn(`⚠️ Предупреждение при загрузке звука ${soundName}:`, error);
            });
          }
          
        } catch (error) {
          console.error(`❌ Критическая ошибка при создании аудио ${soundName}:`, error);
          sounds[soundName] = createDummySound();
          resolve(sounds[soundName]);
        }
      });
      */
    }

    // Создание заглушки для звука (закомментирована)
    function createDummySound() {
      /*
      const dummyAudio = new Audio();
      dummyAudio.volume = 0;
      const silentMp3 = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMQAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
      dummyAudio.src = silentMp3;
      return dummyAudio;
      */
    }

    // Функция воспроизведения звука с настройкой громкости (закомментирована)
    function playSound(soundName, volume = 1.0) {
      // Звук отключен - ничего не воспроизводим
      return;
      /*
      try {
        if (!isSoundOn) return; // Если звук выключен, не воспроизводим
        
        if (!audioContext) {
          initAudio();
        }
        
        if (!sounds[soundName] || !(sounds[soundName] instanceof HTMLAudioElement)) {
          console.warn(`⚠️ Звук ${soundName} не загружен, пытаюсь загрузить...`);
          
          if (AUDIO_DATA[soundName]) {
            loadSoundFromBase64(soundName, AUDIO_DATA[soundName]);
          } else {
            console.error(`❌ Звук ${soundName} не найден в AUDIO_DATA`);
            return;
          }
          
          if (!sounds[soundName]) {
            sounds[soundName] = createDummySound();
          }
        }
        
        const sound = sounds[soundName];
        const soundClone = sound.cloneNode();
        soundClone.volume = volume;
        soundClone.currentTime = 0;
        
        if (audioContext && audioContext.state === 'suspended') {
          audioContext.resume();
        }
        
        const playPromise = soundClone.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.warn(`⚠️ Не удалось воспроизвести звук ${soundName}:`, error);
            try {
              sound.currentTime = 0;
              sound.volume = volume;
              sound.play().catch(e => console.warn(`Не удалось воспроизвести оригинальный звук ${soundName}:`, e));
            } catch (e) {
              console.error(`❌ Критическая ошибка воспроизведения ${soundName}:`, e);
            }
          });
        }
      } catch (error) {
        console.error(`❌ Ошибка воспроизведения звука ${soundName}:`, error);
      }
      */
    }

    // Функция для воспроизведения звуков с задержкой (закомментирована)
    async function playSoundsWithDelay(soundName1, soundName2, times = 1, delay = 350) {
      // Звук отключен - ничего не воспроизводим
      return;
      /*
      if (!isSoundOn) return; // Если звук выключен, не воспроизводим
      
      for (let i = 0; i < times; i++) {
        playSound(soundName1, 0.8);
        playSound(soundName2, 0.5);
        if (i < times - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
      */
    }
    
    // Создаем объект для управления ресурсами
    const resourceManager = {
      textures: {},

      loadAllResources: async function() {
        try {
          await this.loadAllTexturesFromBase64();
          this.createTextureAliases();
          this.checkEssentialTextures();
          return this.textures;
        } catch (error) {
          console.error('❌ Ошибка загрузки ресурсов:', error);
          throw error;
        }
      },

      loadAllTexturesFromBase64: async function() {
        const loadPromises = [];
        
        const processData = (data, path = '') => {
          for (const [key, value] of Object.entries(data)) {
            const fullPath = path ? `${path}_${key}` : key;
            
            if (typeof value === 'string' && value.startsWith('data:image')) {
              loadPromises.push(this.loadTextureFromBase64(fullPath, value, key));
            } else if (typeof value === 'object' && value !== null) {
              processData(value, fullPath);
            }
          }
        };
        
        processData(IMAGE_DATA);
        await Promise.all(loadPromises);
      },

      loadTextureFromBase64: function(key, base64Data, originalKey) {
        return new Promise((resolve) => {
          try {
            const cleanBase64 = base64Data.replace(/\s/g, '');
            const img = new Image();
            
            img.onload = () => {
              const texture = PIXI.Texture.from(img);
              this.textures[key] = texture;
              
              if (originalKey && originalKey !== key) {
                this.textures[originalKey] = texture;
              }
              resolve();
            };
            
            img.onerror = (error) => {
              console.error(`   ❌ Ошибка загрузки изображения для ${key}:`, error);
              this.textures[key] = this.createPlaceholderTexture(key);
              if (originalKey && originalKey !== key) {
                this.textures[originalKey] = this.textures[key];
              }
              resolve();
            };
            
            img.src = cleanBase64;
            
          } catch (error) {
            console.error(`   ❌ Ошибка при создании текстуры ${key}:`, error);
            this.textures[key] = this.createPlaceholderTexture(key);
            if (originalKey && originalKey !== key) {
              this.textures[originalKey] = this.textures[key];
            }
            resolve();
          }
        });
      },

      createTextureAliases: function() {
        // ... существующий код создания алиасов ...
        
        if (this.textures['bg0000'] || this.textures['bg']) {
          const bgTexture = this.textures['bg0000'] || this.textures['bg'];
          this.textures['bg'] = bgTexture;
          this.textures['background'] = bgTexture;
        }
        
        if (this.textures['play_button'] || this.textures['play']) {
          const playTexture = this.textures['play_button'] || this.textures['play'];
          this.textures['play_button'] = playTexture;
          this.textures['play'] = playTexture;
        }
        
        if (this.textures['field']) {
          this.textures['field'] = this.textures['field'];
        }
        
        if (this.textures['BE']) {
          this.textures['ball'] = this.textures['BE'];
          this.textures['BE'] = this.textures['BE'];
        }
        
        if (this.textures['panel']) {
          this.textures['ui_panel'] = this.textures['panel'];
          this.textures['IMG_panel'] = this.textures['panel'];
        }
        
        if (this.textures['balance plush']) {
          this.textures['ui_hidder'] = this.textures['balance plush'];
          this.textures['IMG_balance_plush'] = this.textures['balance plush'];
        }
        
        const multiplierNames = ['x50', 'x10', 'x5', 'x2', 'x1'];
        
        multiplierNames.forEach(name => {
          const foundKey = Object.keys(this.textures).find(key => 
            key.toLowerCase().includes(name.toLowerCase())
          );
          
          if (foundKey) {
            const aliasKey = `IMG_${name}.png`;
            this.textures[aliasKey] = this.textures[foundKey];
            this.textures[name] = this.textures[foundKey];
          } else {
            console.warn(`   ⚠️ Текстура множителя не найдена: ${name}`);
          }
        });
        
        const packshotTextures = [
          'BgDArck', 'BigWinRed', 'Smartphone', 
          'packshot balls0', 'logo', 'button', 'ph.land', 'ph.port'
        ];
        
        packshotTextures.forEach(textureName => {
          const foundKey = Object.keys(this.textures).find(key => 
            key.toLowerCase().includes(textureName.toLowerCase())
          );
          
          if (foundKey) {
            const aliasKey = `IMG_${textureName.replace(/\s+/g, '_')}`;
            this.textures[aliasKey] = this.textures[foundKey];
            this.textures[textureName] = this.textures[foundKey];
            
            if (textureName === 'Smartphone') {
              this.textures['IMG_Smartphone_Smartphone_0000'] = this.textures[foundKey];
            }
          } else {
            console.warn(`   ⚠️ Текстура для пэкшота не найдена: ${textureName}`);
          }
        });
        
        for (let i = 0; i < 30; i++) {
          const frameNum = i.toString().padStart(3, '0');
          const frameKey = `frame_${frameNum}`;
          
          if (IMAGE_DATA.Coins && IMAGE_DATA.Coins[frameKey]) {
            const base64Data = IMAGE_DATA.Coins[frameKey];
            this.loadTextureFromBase64(`Coins_${frameKey}`, base64Data, frameKey);
            this.textures[frameKey] = this.textures[`Coins_${frameKey}`];
          }
        }
        
        if (IMAGE_DATA.Coins && IMAGE_DATA.Coins['frame_000']) {
          this.textures['coins_animation'] = this.textures['frame_000'];
        }
        
        Object.keys(this.textures).forEach(key => {
          const keyLower = key.toLowerCase();
          
          if (keyLower.includes('logo') && keyLower.includes('90_100')) {
            this.textures['IMG_logo.png_90_100'] = this.textures[key];
          }
          
          if (keyLower.includes('packshot') && keyLower.includes('balls')) {
            this.textures['IMG_packshot_balls0'] = this.textures[key];
          }
        });
      },

      checkEssentialTextures: function() {
        const essentialTextures = ['bg', 'play_button', 'field', 'ball', 'ui_panel', 'ui_hidder'];
        
        essentialTextures.forEach(textureName => {
          if (!this.textures[textureName]) {
            console.warn(`   ⚠️ Текстура "${textureName}" не найдена, создаю заглушку`);
            this.textures[textureName] = this.createPlaceholderTexture(textureName);
          } 
        });
      },

      createPlaceholderTexture: function(name) {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        
        const colors = {
          'bg': '#0000FF',
          'play_button': '#FF0000',
          'field': '#00FF00',
          'ball': '#FFFF00',
          'ui_panel': '#8B4513',
          'ui_hidder': '#2E8B57',
          'default': '#888888'
        };
        
        const color = colors[name] || colors['default'];
        
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 200, 200);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(name.toUpperCase(), 100, 80);
        ctx.fillText('PLACEHOLDER', 100, 120);
        
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(50, 50);
        ctx.lineTo(150, 150);
        ctx.moveTo(150, 50);
        ctx.lineTo(50, 150);
        ctx.stroke();
        
        return PIXI.Texture.from(canvas);
      },

      getTexture: function(key) {
        if (this.textures[key]) {
          return this.textures[key];
        }
        
        const searchKey = key.toLowerCase().replace(/img_/g, '');
        
        for (const [textureKey, texture] of Object.entries(this.textures)) {
          const textureKeyLower = textureKey.toLowerCase();
          
          if (textureKey === key || 
              textureKeyLower === key.toLowerCase() ||
              textureKeyLower.includes(searchKey) ||
              textureKeyLower.replace(/[^a-z0-9]/g, '').includes(searchKey.replace(/[^a-z0-9]/g, ''))) {
            return texture;
          }
        }
        
        console.error(`   ❌ Текстура "${key}" не найдена!`);
        return this.createPlaceholderTexture(key);
      },
      
      findTexturesByPattern: function(pattern) {
        const result = [];
        const regex = new RegExp(pattern.replace(/\*/g, '.*'), 'i');
        
        for (const [key, texture] of Object.entries(this.textures)) {
          if (regex.test(key)) {
            result.push({ key, texture });
          }
        }
        
        return result;
      }
    };

    sdk.init(() => {
      sdk.start();
    });
      
    sdk.on('resize', () => {
    });
      
    sdk.on('finish', () => {
    });

    pixiContainer = document.getElementById('pixi-container');
    if (!pixiContainer) {
      throw new Error('Элемент #pixi-container не найден в DOM');
    }

    await app.init({ 
      background: "#000000", 
      resizeTo: window,
      autoStart: false,
      canvas: document.createElement('canvas')
    });

    pixiContainer.appendChild(app.canvas);

    gameContainer = new Container();
    app.stage.addChild(gameContainer);

    await resourceManager.loadAllResources();

    let handTexture;
    try {
      handTexture = await Assets.load(IMAGE_DATA.hand);
    } catch (error) {
      console.warn('⚠️ Не удалось загрузить текстуру руки:', error);
    }
    
    const multiplierTextures = [];
    for (const file of multiplierFiles) {
      try {
        const fileName = file.replace('.png', '');
        
        const possibleKeys = [
          `IMG_${file}`,
          fileName,
          file,
          file.toLowerCase(),
          fileName.toLowerCase()
        ];
        
        let texture = null;
        for (const key of possibleKeys) {
          if (resourceManager.getTexture(key)) {
            texture = resourceManager.getTexture(key);
            break;
          }
        }
        
        if (!texture) {
          console.warn(`⚠️ Текстура множителя не найдена: ${file}`);
          texture = resourceManager.createPlaceholderTexture(file);
        }
        
        multiplierTextures.push(texture);
      } catch (error) {
        console.error(`❌ Ошибка загрузки текстуры множителя ${file}:`, error);
        multiplierTextures.push(resourceManager.createPlaceholderTexture(file));
      }
    }

    const bgTex = resourceManager.getTexture('bg');
    const playTex = resourceManager.getTexture('play_button');
    const fieldTex = resourceManager.getTexture('field');
    const ballTex = resourceManager.getTexture('ball');
    const uiPanelTex = resourceManager.getTexture('ui_panel');
    const uiHidderTex = resourceManager.getTexture('ui_hidder');

    bg = new Sprite(bgTex);
    play = new Sprite(playTex);
    field = new Sprite(fieldTex);
    uiPanel = new Sprite(uiPanelTex);
    uiHidder = new Sprite(uiHidderTex);
    
    handSprite = new Sprite(handTexture);
    
    for (let i = 0; i < 10; i++) {
      ballsArray.push(new Sprite(ballTex));
    }
    
    for (const index of multiplierOrder) {
      if (multiplierTextures[index]) {
        const multiplierSprite = new Sprite(multiplierTextures[index]);
        multiplierSprite.userData = {
          originalY: 0,
          isAnimating: false,
          animationStartTime: 0,
          multiplierIndex: index
        };
        multiplierSprites.push(multiplierSprite);
      }
    }

    const balanceStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 60,
      fill: '#ffff00',
      fontWeight: 'bold'
    });

    const betStyle = new TextStyle({
      fontFamily: 'Arial',
      fill: '#ffffff',
      stroke: '#000000',
      fontWeight: '600'
    });

    // Стиль для надписи "For illustrative purposes only"
    const disclaimerStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 16,
      fill: '#ffffff',
      fontWeight: 'normal',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 2
    });

    balanceText = new Text({ text: "€200", style: balanceStyle });
    betText = new Text({ text: "INZET: 20 €", style: betStyle });
    
    // Создаем disclaimer текст (будет виден всегда)
    disclaimerText = new Text({ 
      text: "For illustrative purposes only", 
      style: disclaimerStyle 
    });
    disclaimerText.zIndex = 999999; // Очень высокий zIndex
    
    let gameState = {
      index: 0
    }

    const rewards = [
      732, 1953, 3249, 4592, 7904, 8603, 11342, 15207, 17348, 19158
    ]

    // Координаты для мячей (без изменений)
    const ball1Coords = [
      { x: 0, y: -200 }, { x: 20, y: -150 }, { x: 37, y: -100 },
      { x: 13, y: -50 }, { x: -15, y: 0 }, { x: -20, y: 50 },
      { x: 22, y: 100 }, { x: -15, y: 160 }, { x: 0, y: 175 }
    ];

    const ball2Coords = [
      { x: 0, y: -200 }, { x: -20, y: -140 }, { x: -37, y: -90 },
      { x: -13, y: -40 }, { x: 20, y: 10 }, { x: 30, y: 50 },
      { x: -23, y: 100 }, { x: 0, y: 150 }, { x: 0, y: 175 }
    ];

    const ball3Coords = [
      { x: 0, y: -200 }, { x: 17, y: -150 }, { x: 34, y: -100 },
      { x: 13, y: -50 }, { x: 40, y: 0 }, { x: 48, y: 50 },
      { x: 38, y: 90 }, { x: 25, y: 150 }, { x: 36, y: 175 }
    ];

    const ball4Coords = [
      { x: 0, y: -200 }, { x: -17, y: -150 }, { x: -34, y: -100 },
      { x: -15, y: -50 }, { x: -39, y: 0 }, { x: -60, y: 50 },
      { x: -85, y: 100 }, { x: -90, y: 150 }, { x: -75, y: 175 }
    ];

    const ball5Coords = [
      { x: 0, y: -200 }, { x: 20, y: -150 }, { x: 0, y: -100 },
      { x: -17, y: -50 }, { x: -34, y: 0 }, { x: -17, y: 50 },
      { x: -47, y: 100 }, { x: -65, y: 150 }, { x: -75, y: 175 }
    ];

    const ball6Coords = [
      { x: 0, y: -200 }, { x: -17, y: -150 }, { x: 0, y: -100 },
      { x: 20, y: -50 }, { x: 39, y: 0 }, { x: 58, y: 50 },
      { x: 72, y: 100 }, { x: 52, y: 140 }, { x: 75, y: 175 }
    ];

    const ball7Coords = [
      { x: 0, y: -200 }, { x: -17, y: -150 }, { x: -34, y: -100 },
      { x: -15, y: -50 }, { x: -38, y: 0 }, { x: -60, y: 50 },
      { x: -76, y: 100 }, { x: -58, y: 140 }, { x: -80, y: 175 }
    ];

    const ball8Coords = [
      { x: 0, y: -200 }, { x: -17, y: -150 }, { x: -34, y: -100 },
      { x: -10, y: -50 }, { x: 3, y: -10 }, { x: 15, y: 50 },
      { x: 0, y: 100 }, { x: 18, y: 140 }, { x: 0, y: 175 }
    ];

    const ball9Coords = [
      { x: 0, y: -200 }, { x: 17, y: -150 }, { x: 0, y: -100 },
      { x: -17, y: -50 }, { x: -34, y: 0 }, { x: -17, y: 50 },
      { x: -47, y: 100 }, { x: -65, y: 150 }, { x: -75, y: 175 }
    ];

    const ball10Coords = [
      { x: 0, y: -200 }, { x: -17, y: -150 }, { x: -34, y: -100 },
      { x: -10, y: -50 }, { x: -34, y: 0 }, { x: -66, y: 50 },
      { x: -85, y: 100 }, { x: -105, y: 150 }, { x: -115, y: 175 }
    ];

    ballPaths.push(ball1Coords, ball2Coords, ball3Coords, ball4Coords, ball5Coords, 
                  ball6Coords, ball7Coords, ball8Coords, ball9Coords, ball10Coords);
    
    // Инициализация состояний шаров с добавлением вращения
    for (let i = 0; i < ballsArray.length; i++) {
      ballStates.push({
        isAnimating: false,
        currentCoordIndex: 0,
        animationStartTime: 0,
        rotationSpeed: 0,  // Скорость вращения
        previousX: 0,      // Предыдущая позиция X для расчета направления
        rotationDirection: 0 // Направление вращения (1 - по часовой, -1 - против)
      });
    }

    // Функции для управления состоянием игры
    const getState = () => {
      const activeBalls = ballsArray.filter((ball, index) => ballStates[index]?.isAnimating || ball.visible);
      return {
        ballsReleased: gameState.index,
        activeBalls: activeBalls,
        MAX_BALLS: 10
      };
    };

    const fw = field.width;
    
    // ============ ФУНКЦИЯ ДЛЯ АНИМАЦИИ КНОПКИ PLAY ============
    function animateButtonPress() {
      if (isButtonAnimating) return;
      
      isButtonAnimating = true;
      const originalScale = play.scale.x;
      const startTime = performance.now();
      
      const animate = () => {
        const elapsedTime = performance.now() - startTime;
        const progress = Math.min(elapsedTime / BUTTON_ANIMATION_DURATION, 1);
        
        if (progress < 0.5) {
          // Первая половина: уменьшение
          const scaleProgress = progress * 2;
          const scale = originalScale * (1 - scaleProgress * 0.15); // Уменьшаем на 15%
          play.scale.set(scale);
        } else {
          // Вторая половина: возврат к оригинальному размеру с легким превышением и обратно
          const bounceProgress = (progress - 0.5) * 2;
          
          // Легкое превышение оригинального размера и возврат
          if (bounceProgress < 0.7) {
            // Увеличиваем немного больше оригинального размера
            const overshoot = 0.05; // 5% превышение
            const easeIn = bounceProgress / 0.7;
            const scale = originalScale * (1 + overshoot * easeIn);
            play.scale.set(scale);
          } else {
            // Возвращаем к оригинальному размеру
            const easeOut = (bounceProgress - 0.7) / 0.3;
            const overshoot = 0.05 * (1 - easeOut);
            const scale = originalScale * (1 + overshoot);
            play.scale.set(scale);
          }
        }
        
        if (progress >= 1) {
          // Завершение анимации, точный возврат к оригинальному размеру
          play.scale.set(originalScale);
          isButtonAnimating = false;
          return;
        }
        
        requestAnimationFrame(animate);
      };
      
      animate();
    }
    
    // ============ ФУНКЦИИ ДЛЯ АНИМАЦИИ КОРЗИНОК ============
    function animateBasket(basketSprite) {
      if (!basketSprite || basketSprite.userData.isAnimating) return;
      
      if (!basketSprite.userData.originalY) {
        basketSprite.userData.originalY = basketSprite.y;
      }
      
      basketSprite.userData.isAnimating = true;
      basketSprite.userData.animationStartTime = performance.now();
      basketSprite.userData.originalY = basketSprite.y;
      
      basketAnimations.set(basketSprite, basketSprite.userData);
    }
    
    function updateBasketAnimations() {
      const currentTime = performance.now();
      
      basketAnimations.forEach((animationData, basketSprite) => {
        if (!animationData.isAnimating) {
          basketAnimations.delete(basketSprite);
          return;
        }
        
        const elapsedTime = currentTime - animationData.animationStartTime;
        const progress = Math.min(elapsedTime / BASKET_ANIMATION_DURATION, 1);
        
        if (progress >= 1) {
          basketSprite.y = animationData.originalY;
          basketSprite.scale.x = 1.1;
          basketSprite.scale.y = 1.1;
          basketSprite.userData.isAnimating = false;
          basketAnimations.delete(basketSprite);
          return;
        }
        
        const bounce = Math.sin(progress * Math.PI);
        const damping = Math.pow(1 - progress, 2);
        const yOffset = BASKET_BOUNCE_HEIGHT * bounce * damping;
        
        basketSprite.y = animationData.originalY + yOffset;
        
        const scaleX = 1.1 + 0.05 * Math.sin(progress * Math.PI * 2) * damping;
        const scaleY = 1.1 * (1 - 0.02 * Math.sin(progress * Math.PI * 2) * damping);
        
        basketSprite.scale.x = scaleX;
        basketSprite.scale.y = scaleY;
      });
    }
    
    function easeOutBounce(x) {
      const n1 = 7.5625;
      const d1 = 2.75;
      
      if (x < 1 / d1) {
        return n1 * x * x;
      } else if (x < 2 / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75;
      } else if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375;
      } else {
        return n1 * (x -= 2.625 / d1) * x + 0.984375;
      }
    }
    
    function setupMultipliers() {
      if (multiplierSprites.length === 0) return;
      
      let totalWidth = 0;
      const scale = 1.1;
      
      for (const sprite of multiplierSprites) {
        sprite.anchor.set(0.5);
        sprite.scale.set(scale);
        totalWidth += sprite.width;
      }
      
      const startX = -totalWidth / 2;
      let currentX = startX;
      
      for (let i = 0; i < multiplierSprites.length; i++) {
        const sprite = multiplierSprites[i];
        sprite.x = currentX + sprite.width / 2;
        sprite.y = fw / 2 - sprite.height / 2 - 20;
        
        sprite.userData.originalY = sprite.y;
        currentX += sprite.width;
        
        if (!sprite.parent) {
          field.addChild(sprite);
        }
      }
    }
    
    function checkOrientation() {
      const vw = app.screen.width;
      const vh = app.screen.height;
      screenRatio = vw / vh;
      
      // Определяем портретную ориентацию
      isPortrait = vh > vw;
      
      // Определяем квадратное разрешение (отношение сторон между 0.8 и 1.2)
      isSquare = screenRatio >= 0.8 && screenRatio <= 1.2;
      
      console.log(`Разрешение: ${vw}x${vh}, соотношение: ${screenRatio.toFixed(2)}, квадратное: ${isSquare}, портретное: ${isPortrait}`);
      
      return { isPortrait, isSquare, screenRatio };
    }
    
    // Функция для определения размера шрифта в зависимости от соотношения сторон
    function getFontSizeForAspectRatio(baseFontSize) {
      // 4 категории размеров для разных соотношений сторон:
      // 1. Очень квадратное (0.8-1.0) - самый маленький шрифт
      // 2. Квадратное (1.0-1.1) - маленький шрифт
      // 3. Умеренное (1.1-1.3) - средний шрифт
      // 4. Широкое (>1.3) - большой шрифт
      
      if (screenRatio >= 0.8 && screenRatio < 1.0) {
        // Очень квадратное
        return baseFontSize * 0.7;
      } else if (screenRatio >= 1.0 && screenRatio < 1.1) {
        // Квадратное
        return baseFontSize * 0.8;
      } else if (screenRatio >= 1.1 && screenRatio < 1.3) {
        // Умеренное
        return baseFontSize * 0.9;
      } else {
        // Широкое или портретное с большим соотношением
        return baseFontSize;
      }
    }

    // Функция для обновления disclaimer текста (будет вызываться при каждом изменении размера)
    function updateDisclaimerText() {
      if (!disclaimerText) return;
      
      const vw = app.screen.width;
      const vh = app.screen.height;
      
      disclaimerText.anchor.set(0.5);
      disclaimerText.position.set(vw / 2, vh - 20); // Внизу по центру
      
      // Адаптивный размер шрифта для disclaimer
      let disclaimerFontSize;
      if (isPortrait) {
        disclaimerFontSize = Math.min(vw * 0.03, 16);
      } else {
        disclaimerFontSize = Math.min(vh * 0.02, 16);
      }
      disclaimerText.style.fontSize = Math.max(10, disclaimerFontSize);
      
      // Добавляем disclaimerText в app.stage, если его там еще нет
      // И удаляем из других контейнеров, чтобы он был только в app.stage
      if (disclaimerText.parent && disclaimerText.parent !== app.stage) {
        disclaimerText.parent.removeChild(disclaimerText);
      }
      
      if (!disclaimerText.parent) {
        app.stage.addChild(disclaimerText);
      }
      
      // Устанавливаем самый высокий zIndex
      disclaimerText.zIndex = 999999;
    }
    
    function setupElements() {
      const vw = app.screen.width;
      const vh = app.screen.height;
      
      checkOrientation();
      
      bg.anchor.set(0.5);
      bg.scale.set(1);
      const scaleX = vw / bg.width;
      const scaleY = vh / bg.height;
      const scale = Math.max(scaleX, scaleY);
      bg.scale.set(scale);
      bg.position.set(vw / 2, vh / 2);
      
      uiHidder.anchor.set(0.5);
      uiHidder.scale.set(0.75);
      
      let uiHidderScale;
      if (isPortrait) {
        uiHidderScale = (vw * 0.9 / uiHidder.width) * 0.5;
      } else {
        uiHidderScale = (vh * 0.15 / uiHidder.height) * 0.5;
      }
      uiHidder.scale.set(uiHidderScale);
      
      uiHidder.position.set(vw / 2, uiHidder.height / 2 + 5);
      
      uiPanel.anchor.set(0.5);
      uiPanel.scale.set(1);
      
      let uiPanelScale;
      if (isPortrait) {
        uiPanelScale = vw * 0.9 / uiPanel.width;
      } else {
        uiPanelScale = vh * 0.25 / uiPanel.height;
      }
      uiPanel.scale.set(uiPanelScale);
      
      // Для квадратных и портретных 9х16 - поднимаем выше
      if (isSquare || (isPortrait && screenRatio < 0.7)) {
        uiPanel.position.set(vw / 2, vh - uiPanel.height / 2 - 60);
      } else {
        uiPanel.position.set(vw / 2, vh - uiPanel.height / 2 - 30);
      }
      
      balanceText.anchor.set(0.5);
      
      // РАЗНЫЙ РАЗМЕР ШРИФТА В ЗАВИСИМОСТИ ОТ СООТНОШЕНИЯ СТОРОН
      let balanceFontSize;
      if (isPortrait) {
        const baseFontSize = uiHidder.height * 2;
        balanceFontSize = getFontSizeForAspectRatio(baseFontSize);
      } else {
        const baseFontSize = uiHidder.height * 5;
        balanceFontSize = getFontSizeForAspectRatio(baseFontSize);
      }
      
      const minFontSize = 24;
      const maxFontSize = 120;
      balanceFontSize = Math.max(minFontSize, Math.min(balanceFontSize, maxFontSize));
      
      balanceText.style.fontSize = balanceFontSize;
      balanceText.position.set(0, 0);
      
      betText.anchor.set(0.5);
      
      let betFontSize;
      if (isPortrait) {
        const baseBetFontSize = uiPanel.height * 0.18;
        betFontSize = getFontSizeForAspectRatio(baseBetFontSize);
      } else {
        const baseBetFontSize = uiPanel.height * 0.18;
        betFontSize = getFontSizeForAspectRatio(baseBetFontSize);
      }
      
      const minBetFontSize = 16;
      const maxBetFontSize = 40;
      betFontSize = Math.max(minBetFontSize, Math.min(betFontSize, maxBetFontSize));
      
      betText.style.fontSize = betFontSize;
      betText.position.set(0, 0 + 100);
      
      field.anchor.set(0.5);
      
      const uiHidderBottom = uiHidder.y + uiHidder.height / 2;
      const uiPanelTop = uiPanel.y - uiPanel.height / 2;
      const availableHeight = uiPanelTop - uiHidderBottom;
      const availableWidth = vw * 0.9;
      
      const scaleByWidth = availableWidth / fw;
      const scaleByHeight = availableHeight / fw;
      
      let fieldScale = Math.min(scaleByWidth, scaleByHeight);
      
      const minScale = 0.3;
      const maxScale = 1.0;
      fieldScale = Math.max(minScale, Math.min(fieldScale, maxScale));
      
      field.scale.set(fieldScale);
      
      const fieldX = vw / 2;
      const fieldY = uiHidderBottom + availableHeight / 2;
      
      field.position.set(fieldX, fieldY);
      
      ballsArray.forEach((ballSprite, index) => {
        ballSprite.anchor.set(0.5);
        ballSprite.scale.set(0.025 * (1 / fieldScale));
        ballSprite.visible = false;
        
        if (ballPaths[index] && ballPaths[index][0]) {
          ballSprite.position.set(ballPaths[index][0].x, ballPaths[index][0].y);
        }
      });
      
      play.anchor.set(0.5);
      play.scale.set(1);
      
      let playScale;
      if (isPortrait) {
        playScale = Math.min(vw * 0.25, vh * 0.18) / play.width;
      } else {
        playScale = Math.min(vw * 0.2, vh * 0.15) / play.width;
      }
      play.scale.set(playScale);
      
      let playY;
      if (isPortrait) {
        playY = uiPanel.y - uiPanel.height / 2.2 + play.height / 2;
      } else {
        playY = vh - play.height * 1.4;
      }
      play.position.set(vw / 2, playY);
      play.eventMode = 'static';
      play.cursor = 'pointer';
      
      if (handSprite) {
        handSprite.anchor.set(0.5,0.5);
        handSprite.scale.set(0.6);
        
        const handOffsetX = -play.width * 0.1;
        const handOffsetY = -play.height * 0.1;
        
        handSprite.position.set(
          play.x + play.width / 2 + handOffsetX,
          play.y + play.height / 2 + handOffsetY
        );
        
        handSprite.visible = !isFirstClick;
        handSprite.zIndex = 100;
      }
      
      multiplierSprites.forEach(sprite => {
        if (sprite.userData) {
          sprite.userData.originalY = sprite.y;
        }
      });
      
      gameContainer.removeChildren();
      gameContainer.addChild(bg);
      gameContainer.addChild(field);
      gameContainer.addChild(uiHidder);
      gameContainer.addChild(uiPanel);
      gameContainer.addChild(play);
      
      if (handSprite) {
        gameContainer.addChild(handSprite);
      }
      
      uiPanel.addChild(betText);
      uiHidder.addChild(balanceText);
      
      ballsArray.forEach(ballSprite => {
        field.addChild(ballSprite);
      });
      
      setupMultipliers();
      
      // Обновляем disclaimer текст (он будет добавлен в app.stage отдельно)
      updateDisclaimerText();
      
      play.removeAllListeners();
      play.on('pointerdown', (event) => {
        event.stopPropagation();
        
        animateButtonPress();
        
        // Звук отключен
        // playSound('buttonClick', 0.5);
        
        if (!isFirstClick) {
          isFirstClick = true;
          if (handSprite) {
            handSprite.visible = false;
          }
        }
        
        playFunc();
      });
      
      if (isPackshotActive && packshotOverlay && packshotOverlay.parent) {
        updatePackshotLayout();
      }
    }

    setupElements();

    let resizeTimeout;
    function handleResize() {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      
      resizeTimeout = setTimeout(() => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        setupElements();
        
        if (isPackshotActive && packshotOverlay && packshotOverlay.parent) {
          updatePackshotLayout();
        }
      }, 100);
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    function playFunc() {
      const currentBallIndex = gameState.index;
      
      if (currentBallIndex >= ballsArray.length) {
        return;
      }
      
      const ballState = ballStates[currentBallIndex];
      updateBalance(currentBalance - 20);
      
      if (ballState.isAnimating) return;
      
      ballState.isAnimating = true;
      ballState.currentCoordIndex = 0;
      ballState.animationStartTime = performance.now();
      ballState.rotationSpeed = 0;
      ballState.previousX = ballPaths[currentBallIndex][0].x;
      ballState.rotationDirection = 0;
      
      const currentBall = ballsArray[currentBallIndex];
      const currentPath = ballPaths[currentBallIndex];
      currentBall.visible = true;
      currentBall.position.set(currentPath[0].x, currentPath[0].y);
      currentBall.rotation = 0;
      
      gameState.index++;
      
      if (currentBallIndex === 0) {
        app.ticker.add(animateAllBalls);
      }
    }

    // ============ ОБНОВЛЕННАЯ ФУНКЦИЯ АНИМАЦИИ ШАРОВ С ВРАЩЕНИЕМ ============
    function animateAllBalls() {
      const currentTime = performance.now();
      
      for (let i = 0; i < ballsArray.length; i++) {
        const ballState = ballStates[i];
        
        if (!ballState.isAnimating) continue;
        
        const currentBall = ballsArray[i];
        const currentPath = ballPaths[i];
        const elapsedTime = currentTime - ballState.animationStartTime;
        const totalAnimationTime = 3500;
        
        if (elapsedTime >= totalAnimationTime) {
          currentBall.position.set(
            currentPath[currentPath.length - 1].x,
            currentPath[currentPath.length - 1].y
          );
          finishAnimation(i);
          continue;
        }
        
        const totalProgress = elapsedTime / totalAnimationTime;
        
        const segmentCount = currentPath.length - 1;
        const currentSegmentIndex = Math.floor(totalProgress * segmentCount);
        const segmentProgress = (totalProgress * segmentCount) % 1;
        
        if (currentSegmentIndex > ballState.currentCoordIndex) {
          ballState.currentCoordIndex = currentSegmentIndex;
        }
        
        if (ballState.currentCoordIndex >= currentPath.length - 1) {
          currentBall.position.set(
            currentPath[currentPath.length - 1].x,
            currentPath[currentPath.length - 1].y
          );
          finishAnimation(i);
          continue;
        }
        
        const dynamicSpeedFactor = 1.0 - 0.25 * Math.sin(segmentProgress * Math.PI);
        const easeProgress = segmentProgress * dynamicSpeedFactor;
        
        const startPoint = currentPath[ballState.currentCoordIndex];
        const endPoint = currentPath[ballState.currentCoordIndex + 1];
        
        const newX = startPoint.x + (endPoint.x - startPoint.x) * easeProgress;
        const newY = startPoint.y + (endPoint.y - startPoint.y) * easeProgress;
        
        const deltaX = newX - ballState.previousX;
        
        const baseRotationSpeed = 0.06;
        const rotationSpeedMultiplier = Math.min(Math.abs(deltaX) * 10, 2.0);
        
        let rotationDirection;
        if (deltaX > 0.01) {
          rotationDirection = -1;
        } else if (deltaX < -0.01) {
          rotationDirection = 1;
        } else {
          rotationDirection = 0;
        }
        
        const targetRotationSpeed = rotationDirection * baseRotationSpeed * rotationSpeedMultiplier;
        const rotationLerpFactor = 0.1;
        ballState.rotationSpeed += (targetRotationSpeed - ballState.rotationSpeed) * rotationLerpFactor;
        
        currentBall.rotation += ballState.rotationSpeed;
        
        if (Math.abs(currentBall.rotation) > Math.PI * 2) {
          currentBall.rotation %= Math.PI * 2;
        }
        
        currentBall.x = newX;
        currentBall.y = newY;
        
        ballState.previousX = newX;
        
        if (currentSegmentIndex === segmentCount - 1 && segmentProgress > 0.95) {
          const shakeIntensity = (1 - segmentProgress) * 2;
          currentBall.x += Math.sin(Date.now() * 0.03) * shakeIntensity;
        }
      }
    }

    function easeInOutQuad(t) {
      return t;
    }

    function updateBalance(newValue) {
      // Звук отключен
      // playSound('balanceChange', 0.3);
      
      currentBalance = newValue;
      
      if (balanceAnimation.active) {
        displayedBalance = balanceAnimation.targetValue;
        balanceAnimation.active = false;
      }
      
      balanceAnimation = {
        active: true,
        startTime: performance.now(),
        startValue: displayedBalance,
        targetValue: currentBalance
      };
    }

    function animateBalance() {
      if (!balanceAnimation.active) {
        return;
      }
      
      const currentTime = performance.now();
      const elapsedTime = currentTime - balanceAnimation.startTime;
      
      if (elapsedTime >= BALANCE_ANIMATION_DURATION) {
        displayedBalance = balanceAnimation.targetValue;
        balanceAnimation.active = false;
        showBalance(displayedBalance);
        return;
      }
      
      const progress = elapsedTime / BALANCE_ANIMATION_DURATION;
      const easeProgress = 1 - Math.pow(1 - progress, 2);
      
      displayedBalance = Math.round(
        balanceAnimation.startValue +  
        (balanceAnimation.targetValue - balanceAnimation.startValue) * easeProgress
      );
      
      showBalance(displayedBalance);
    }

    function showBalance(value) {
      balanceText.text = "€" + value.toLocaleString('en-US');
    }

    // ============ ОБНОВЛЕННАЯ ФУНКЦИЯ ЗАВЕРШЕНИЯ АНИМАЦИИ ============
    function finishAnimation(ballIndex) {
      const ballState = ballStates[ballIndex];
      ballState.isAnimating = false;
      
      ballState.rotationSpeed = 0;
      ballState.previousX = 0;
      ballState.rotationDirection = 0;
      
      // Звук отключен
      // playSound('magicalWin', 0.5);
      
      const basketIndex = ballToBasketMapping[ballIndex];
      
      if (basketIndex >= 0 && basketIndex < multiplierSprites.length) {
        const targetBasket = multiplierSprites[basketIndex];
        
        if (targetBasket) {
          animateBasket(targetBasket);
        }
      }
      
      updateBalance(rewards[ballIndex]);
      
      setTimeout(() => {
        ballsArray[ballIndex].visible = false;
        ballsArray[ballIndex].rotation = 0;
      }, 200);
    }

    // ============ ФУНКЦИИ ПЭКШОТА ============
    
    function normKeyPart(s) {
      return s.replace(/\s+/g, "_").replace(/[^\w.]/g, "");
    }
    
    function buildKey(...parts) {
      return parts.map(p => normKeyPart(p)).join("_");
    }
    
    async function loadSprite(keyOrValue) {
      const tex = resourceManager.getTexture(keyOrValue);
      return new Sprite(tex);
    }
    
    function tweenValue(app, target, prop, from, to, durationMs) {
      return new Promise((resolve) => {
        const start = performance.now();
        target[prop] = from;
        const update = () => {
          const t = Math.min(1, (performance.now() - start) / durationMs);
          target[prop] = from + (to - from) * easeInOutQuad(t);
          if (t >= 1) {
            app.ticker.remove(update);
            resolve();
          }
        };
        app.ticker.add(update);
      });
    }
    
    function tweenScale(app, sprite, from, to, durationMs) {
      return new Promise((resolve) => {
        const start = performance.now();
        sprite.scale.set(from);
        const update = () => {
          const t = Math.min(1, (performance.now() - start) / durationMs);
          const s = from + (to - from) * easeInOutQuad(t);
          sprite.scale.set(s);
          if (t >= 1) {
            app.ticker.remove(update);
            resolve();
          }
        };
        app.ticker.add(update);
      });
    }
    
    function tweenPosition(app, sprite, to, durationMs) {
      return new Promise((resolve) => {
        const start = performance.now();
        const fromX = sprite.x;
        const fromY = sprite.y;
        const update = () => {
          const t = Math.min(1, (performance.now() - start) / durationMs);
          const tt = easeInOutQuad(t);
          sprite.x = fromX + (to.x - fromX) * tt;
          sprite.y = fromY + (to.y - fromY) * tt;
          if (t >= 1) {
            app.ticker.remove(update);
            resolve();
          }
        };
        app.ticker.add(update);
      });
    }
    
    async function loadPhoneTextures() {
      const textures = [];
      
      for (let i = 0; i <= 53; i++) {
        const pad4 = i.toString().padStart(4, "0");
        const pad3 = i.toString().padStart(3, "0");
        
        const patterns = [
          `*Smartphone*${pad4}*`,
          `*Smartphone*${pad3}*`,
          `*smartphone*${pad4}*`,
          `*smartphone*${pad3}*`,
          `*phone*${pad4}*`,
          `*phone*${pad3}*`,
          `*${pad4}*`,
          `*${pad3}*`
        ];
        
        let textureFound = null;
        
        for (const pattern of patterns) {
          const foundTextures = resourceManager.findTexturesByPattern(pattern);
          if (foundTextures.length > 0) {
            textureFound = foundTextures[0].texture;
            break;
          }
        }
        
        if (textureFound) {
          textures.push(textureFound);
        } else {
          console.warn(`   ⚠️ Не найден кадр ${i} (${pad4})`);
          textures.push(resourceManager.createPlaceholderTexture(`phone_frame_${pad4}`));
        }
      }
      
      return textures;
    }
    
    async function loadCoinsTextures() {
      const textures = [];
      
      for (let i = 1; i < 28; i++) {
        const frameNum = i.toString().padStart(3, '0');
        const frameKey = `frame_${frameNum}`;
        
        const possibleKeys = [
          frameKey,
          `Coins_${frameKey}`,
          `Coins${frameNum}`,
          `coins_${frameNum}`,
          frameNum,
          `frame${frameNum}`
        ];
        
        let textureFound = null;
        
        for (const key of possibleKeys) {
          if (resourceManager.getTexture(key)) {
            textureFound = resourceManager.getTexture(key);
            break;
          }
        }
        
        if (textureFound) {
          textures.push(textureFound);
        } else {
          console.warn(`   ⚠️ Не найден кадр монет ${i} (${frameNum})`);
          textures.push(resourceManager.createPlaceholderTexture(`coin_frame_${frameNum}`));
        }
      }
      
      return textures;
    }
    
    function updatePackshotLayout() {
      if (!isPackshotActive || !packshotOverlay) return;
      
      const vw = app.screen.width;
      const vh = app.screen.height;
      
      if (currentPackshotStage === 'initial') {
        updateInitialPackshotAnimation(vw, vh);
      } else if (currentPackshotStage === 'final' && packshotLayer) {
        updateFinalPackshotLayout(vw, vh);
      }
      
      // Обновляем disclaimer текст при обновлении layout пэкшота
      updateDisclaimerText();
    }
    
    function updateInitialPackshotAnimation(vw, vh) {
      if (!packshotOverlay) return;
      
      const isLandscape = vw > vh;
      const currentScreenRatio = vw / vh;
      
      const bgDark = packshotElements['bgDark'];
      if (bgDark) {
        bgDark.width = vw;
        bgDark.height = vh;
      }
      
      const bgDark2 = packshotElements['bgDark2'];
      if (bgDark2) {
        bgDark2.width = vw;
        bgDark2.height = vh;
      }
      
      if (uiHidder.parent === packshotOverlay) {
        checkOrientation();
        
        let uiHidderScale;
        if (isPortrait) {
          uiHidderScale = (vw * 0.9 / uiHidder.texture.width) * 0.5;
        } else {
          uiHidderScale = (vh * 0.5 / uiHidder.texture.height) * 0.5;
        }
        uiHidder.scale.set(uiHidderScale);
        
        uiHidder.position.set(vw / 2, uiHidder.height / 2 + 10);
        
        let balanceFontSize;
        if (isPortrait) {
          const baseFontSize = uiHidder.height * 2;
          balanceFontSize = getFontSizeForAspectRatio(baseFontSize);
        } else {
          const baseFontSize = uiHidder.height * 5;
          balanceFontSize = getFontSizeForAspectRatio(baseFontSize);
        }
        
        const minFontSize = 24;
        const maxFontSize = 120;
        balanceFontSize = Math.max(minFontSize, Math.min(balanceFontSize, maxFontSize));
        
        balanceText.style.fontSize = balanceFontSize;
        
        balanceText.anchor.set(0.5);
        balanceText.x = 0;
        balanceText.y = 0;
      }
      
      const bigWin = packshotElements['bigWin'];
      if (bigWin) {
        bigWin.anchor.set(0.5);
        
        if (isLandscape) {
          const maxWidth = vw * 0.3;
          const maxHeight = vh * 0.4;
          const scaleByWidth = maxWidth / bigWin.texture.width;
          const scaleByHeight = maxHeight / bigWin.texture.height;
          const bigWinTargetScale = Math.min(scaleByWidth, scaleByHeight);
          
          bigWin.scale.set(bigWinTargetScale);
          bigWin.x = vw / 2;
          bigWin.y = vh / 2;
        } else {
          const maxWidth = vw * 0.8;
          const maxHeight = vh * 0.6;
          const scaleByWidth = maxWidth / bigWin.texture.width;
          const scaleByHeight = maxHeight / bigWin.texture.height;
          const bigWinTargetScale = Math.min(scaleByWidth, scaleByHeight);
          
          bigWin.scale.set(bigWinTargetScale);
          bigWin.x = vw / 2;
          bigWin.y = vh / 2;
        }
      }
      
      const coinsAnim = packshotElements['coinsAnim'];
      if (coinsAnim) {
        coinsAnim.anchor.set(0.5);
        coinsAnim.x = vw / 2;
        
        if (isLandscape) {
          const coinsMaxWidth = vw * 0.6;
          const coinsScale = (coinsMaxWidth / coinsAnim.texture.width) * 0.8;
          coinsAnim.scale.set(coinsScale);
          
          if (bigWin) {
            coinsAnim.y = bigWin.y + bigWin.height * 0.8;
          } else {
            coinsAnim.y = vh * 0.6;
          }
        } else {
          const coinsMaxWidth = vw * 1.0;
          const coinsScale = (coinsMaxWidth / coinsAnim.texture.width) * 0.8 * 2;
          coinsAnim.scale.set(coinsScale);
          
          if (bigWin) {
            coinsAnim.y = bigWin.y + bigWin.height * 0.25;
          } else {
            coinsAnim.y = vh * 0.25;
          }
        }
      }
      
      const phone = packshotElements['phone'];
      const phoneAnim = packshotElements['phoneAnim'];
      
      if (phone) {
        phone.anchor.set(0.5);
        
        if (isLandscape) {
          const maxWidth = vw * 0.5;
          const maxHeight = vh * 0.7;
          const scaleByWidth = maxWidth / phone.texture.width;
          const scaleByHeight = maxHeight / phone.texture.height;
          const phoneTargetScale = Math.min(scaleByWidth, scaleByHeight) * 1.3;
          
          phone.scale.set(phoneTargetScale);
          phone.x = vw / 2;
          phone.y = vh / 2;
        } else {
          const maxWidth = vw * 0.6;
          const maxHeight = vh * 0.8;
          const scaleByWidth = maxWidth / phone.texture.width;
          const scaleByHeight = maxHeight / phone.texture.height;
          const phoneTargetScale = Math.min(scaleByWidth, scaleByHeight) * 1.3;
          
          phone.scale.set(phoneTargetScale);
          phone.x = vw / 2;
          phone.y = vh / 2;
        }
      }
      
      if (phoneAnim) {
        phoneAnim.anchor.set(0.5);
        
        if (isLandscape) {
          const maxWidth = vw * 0.5;
          const maxHeight = vh * 0.7;
          const scaleByWidth = maxWidth / phoneAnim.texture.width;
          const scaleByHeight = maxHeight / phoneAnim.texture.height;
          const phoneTargetScale = Math.min(scaleByWidth, scaleByHeight) * 1.3;
          
          phoneAnim.scale.set(phoneTargetScale);
          phoneAnim.x = vw / 2;
          phoneAnim.y = vh / 2;
        } else {
          const maxWidth = vw * 0.6;
          const maxHeight = vh * 0.8;
          const scaleByWidth = maxWidth / phoneAnim.texture.width;
          const scaleByHeight = maxHeight / phoneAnim.texture.height;
          const phoneTargetScale = Math.min(scaleByWidth, scaleByHeight) * 1.3;
          
          phoneAnim.scale.set(phoneTargetScale);
          phoneAnim.x = vw / 2;
          phoneAnim.y = vh / 2;
        }
      }
    }
    
    function triggerSDKDownload() {
  // Функция проверки валидности ссылки
  function isUrlValid(url) {
    return url && 
           url.trim() !== '' && 
           !url.includes('ССЫЛКУ_СЮДА') && 
           url !== 'about:blank';
  }
  
  const googlePlayUrl = typeof GOOGLE_PLAY_URL !== 'undefined' ? GOOGLE_PLAY_URL : '';
  const appStoreUrl = typeof APP_STORE_URL !== 'undefined' ? APP_STORE_URL : '';
  
  // Проверяем обе ссылки на валидность
  const hasValidGoogleUrl = isUrlValid(googlePlayUrl);
  const hasValidAppStoreUrl = isUrlValid(appStoreUrl);
  
  // Если обе ссылки невалидны - выходим
  if (!hasValidGoogleUrl && !hasValidAppStoreUrl) {
    console.warn("Store URLs are empty, contain placeholder, or are invalid. Skipping download/redirect");
    return;
  }
  
  const isAndroid = /Android/.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  
  // Проверяем, есть ли валидная ссылка для текущей платформы
  let platformHasValidUrl = false;
  if (isAndroid && hasValidGoogleUrl) {
    platformHasValidUrl = true;
  } else if (isIOS && hasValidAppStoreUrl) {
    platformHasValidUrl = true;
  } else if (!isAndroid && !isIOS && (hasValidGoogleUrl || hasValidAppStoreUrl)) {
    // Для других платформ (десктоп) используем любую валидную
    platformHasValidUrl = true;
  }
  
  if (!platformHasValidUrl) {
    console.warn("No valid store URL for the current platform. Skipping download/redirect");
    return;
  }
  
  // Обработка через различные SDK (только если есть валидная ссылка)
  if (typeof sdk !== 'undefined' && sdk.install) {
    // Передаем валидную ссылку в SDK, если API позволяет
    try {
      sdk.install();
    } catch (e) {
      console.error('SDK install failed:', e);
    }
  } 
  else if (window.sdk?.download) {
    window.sdk.download();
  } else if (window.sdk?.openStore) {
    window.sdk.openStore();
  } else if (window.mraid?.open) {
    // Для MRAID передаем конкретную ссылку
    const url = getPlatformSpecificUrl(googlePlayUrl, appStoreUrl, isAndroid, isIOS);
    if (url && isUrlValid(url)) {
      window.mraid.open(url);
    }
  } else if (window.CTAsdk?.install) {
    window.CTAsdk.install();
  } else if (window.fbPlayableAd?.onCTAClick) {
    window.fbPlayableAd.onCTAClick();
  } else {
    console.warn("No SDK found for download handling, using fallback");
    
    // Fallback: открываем валидную ссылку напрямую
    const url = getPlatformSpecificUrl(googlePlayUrl, appStoreUrl, isAndroid, isIOS);
    
    if (url && isUrlValid(url)) {
      window.open(url, '_blank');
    } else {
      console.warn("No valid URL available for fallback redirect");
    }
  }
  
  // Вспомогательная функция для выбора правильной ссылки
  function getPlatformSpecificUrl(googleUrl, appleUrl, android, ios) {
    if (android && isUrlValid(googleUrl)) {
      return googleUrl;
    } else if (ios && isUrlValid(appleUrl)) {
      return appleUrl;
    } else {
      // Для других платформ или если платформа не определена
      // Возвращаем первую валидную ссылку
      return isUrlValid(googleUrl) ? googleUrl : 
             isUrlValid(appleUrl) ? appleUrl : '';
    }
  }
}

    function updateFinalPackshotLayout(vw, vh) {
      if (!packshotLayer) return;
      
      const packshotSprite = packshotLayer.children.find(child => child.name === 'fullscreenPackshot');
      if (packshotSprite) {
        const isLandscape = vw > vh;
        const orientationKey = isLandscape ? 'ph.land' : 'ph.port';
        
        const texture = resourceManager.getTexture(orientationKey);
        if (texture) {
          packshotSprite.texture = texture;
        }
        
        packshotSprite.width = vw;
        packshotSprite.height = vh;
        packshotSprite.x = 0;
        packshotSprite.y = 0;
      }
    }
    
    async function showFinalPackshot(app, overlay, vw, vh) {
      currentPackshotStage = 'final';
      
      packshotLayer = new Container();
      packshotLayer.sortableChildren = true;
      packshotLayer.zIndex = 100000;
      packshotLayer.name = 'packshotLayer';
      overlay.addChild(packshotLayer);
      
      const isLandscape = vw > vh;
      const orientationKey = isLandscape ? 'ph.land' : 'ph.port';
      
      let packshotTexture = resourceManager.getTexture(orientationKey);
     
      const packshotSprite = new Sprite(packshotTexture);
      packshotSprite.anchor.set(0);
      packshotSprite.width = vw;
      packshotSprite.height = vh;
      packshotSprite.x = 0;
      packshotSprite.y = 0;
      packshotSprite.zIndex = 1;
      packshotSprite.name = 'fullscreenPackshot';
      packshotLayer.addChild(packshotSprite);
      
      packshotLayer.eventMode = 'static';
      packshotLayer.cursor = 'pointer';
      
      packshotLayer.on('pointerdown', (event) => {
        triggerSDKDownload();
      });

      packshotLayer.alpha = 0;
      await tweenValue(app, packshotLayer, "alpha", 0, 1, 500);
    }
    
    async function startPackshotSequence(app) {
      const vw = app.renderer.width;
      const vh = app.renderer.height;
      
      isPackshotActive = true;
      currentPackshotStage = 'initial';
      packshotElements = {};
      
      packshotOverlay = new Container();
      packshotOverlay.sortableChildren = true;
      packshotOverlay.zIndex = 99999;
      packshotOverlay.position.set(0, 0);
      packshotOverlay.scale.set(1);
      app.stage.addChild(packshotOverlay);
      
      function fitFullScreen(sprite) {
        sprite.anchor.set(0);
        sprite.x = 0;
        sprite.y = 0;
        sprite.width = vw;
        sprite.height = vh;
      }
      
      const bgDark = await loadSprite(buildKey("IMG", "BgDArck"));
      fitFullScreen(bgDark);
      bgDark.alpha = 0;
      bgDark.zIndex = 0;
      bgDark.name = 'bgDark';
      packshotOverlay.addChild(bgDark);
      packshotElements['bgDark'] = bgDark;
      
      packshotElements['uiHidderOriginalParent'] = uiHidder.parent;
      packshotElements['uiHidderOriginalIndex'] = uiHidder.parent.getChildIndex(uiHidder);
      packshotElements['uiHidderOriginalPosition'] = { x: uiHidder.x, y: uiHidder.y };
      
      gameContainer.removeChild(uiHidder);
      packshotOverlay.addChild(uiHidder);
      
      uiHidder.x = packshotElements['uiHidderOriginalPosition'].x;
      uiHidder.y = packshotElements['uiHidderOriginalPosition'].y;
      uiHidder.zIndex = 2;
      uiHidder.name = 'uiHidderOriginal';
      
      const bigWin = await loadSprite(buildKey("IMG", "BigWinRed"));
      bigWin.anchor.set(0.5);
      
      const isLandscape = vw > vh;
      
      if (isLandscape) {
        const maxWidth = vw * 0.3;
        const maxHeight = vh * 0.4;
        const scaleByWidth = maxWidth / bigWin.texture.width;
        const scaleByHeight = maxHeight / bigWin.texture.height;
        const bigWinTargetScale = Math.min(scaleByWidth, scaleByHeight);
        
        bigWin.scale.set(0);
        bigWin.x = vw / 2;
        bigWin.y = vh / 2;
      } else {
        const maxWidth = vw * 0.8;
        const maxHeight = vh * 0.6;
        const scaleByWidth = maxWidth / bigWin.texture.width;
        const scaleByHeight = maxHeight / bigWin.texture.height;
        const bigWinTargetScale = Math.min(scaleByWidth, scaleByHeight);
        
        bigWin.scale.set(0);
        bigWin.x = vw / 2;
        bigWin.y = vh / 2;
      }
      
      bigWin.zIndex = 3;
      bigWin.name = 'bigWin';
      packshotOverlay.addChild(bigWin);
      packshotElements['bigWin'] = bigWin;
      
      const coinTextures = await loadCoinsTextures();
      
      if (coinTextures.length > 0) {
        const coinsAnim = new PIXI.AnimatedSprite(coinTextures);
        coinsAnim.anchor.set(0.5);
        coinsAnim.x = vw / 2;
        
        if (isLandscape) {
          const coinsMaxWidth = vw * 0.9;
          const coinsScale = (coinsMaxWidth / coinsAnim.texture.width) * 0.8;
          coinsAnim.scale.set(coinsScale);
          coinsAnim.y = vh * 0.6;
        } else {
          const coinsMaxWidth = vw * 1.2;
          const coinsScale = (coinsMaxWidth / coinsAnim.texture.width) * 0.8 * 2;
          coinsAnim.scale.set(coinsScale);
          coinsAnim.y = vh * 0.6;
        }
        
        coinsAnim.loop = true;
        coinsAnim.animationSpeed = 0.2;
        coinsAnim.zIndex = 2.5;
        coinsAnim.name = 'coinsAnim';
        coinsAnim.alpha = 0;
        
        packshotOverlay.addChild(coinsAnim);
        packshotElements['coinsAnim'] = coinsAnim;
      } 

      const bgDark2 = await loadSprite(buildKey("IMG", "BgDArck"));
      fitFullScreen(bgDark2);
      bgDark2.alpha = 0;
      bgDark2.zIndex = 15;
      bgDark2.name = 'bgDark2';
      packshotOverlay.addChild(bgDark2);
      packshotElements['bgDark2'] = bgDark2;
      
      const phone = await loadSprite(buildKey("IMG", "Smartphone", "Smartphone_0000"));
      phone.anchor.set(0.5);
      
      if (isLandscape) {
        const maxWidth = vw * 0.5;
        const maxHeight = vh * 0.7;
        const scaleByWidth = maxWidth / phone.texture.width;
        const scaleByHeight = maxHeight / phone.texture.height;
        const phoneTargetScale = Math.min(scaleByWidth, scaleByHeight) * 1.3;
        
        phone.scale.set(phoneTargetScale);
        phone.x = vw + phone.width;
        phone.y = vh / 2;
      } else {
        const maxWidth = vw * 0.6;
        const maxHeight = vh * 0.8;
        const scaleByWidth = maxWidth / phone.texture.width;
        const scaleByHeight = maxHeight / phone.texture.height;
        const phoneTargetScale = Math.min(scaleByWidth, scaleByHeight) * 1.3;
        
        phone.scale.set(phoneTargetScale);
        phone.x = vw + phone.width;
        phone.y = vh / 2;
      }
      
      phone.zIndex = 16;
      phone.name = 'phone';
      packshotOverlay.addChild(phone);
      packshotElements['phone'] = phone;
      
      await tweenValue(app, bgDark, "alpha", 0, 1, 300);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let bigWinTargetScale;
      if (isLandscape) {
        const maxWidth = vw * 0.3;
        const maxHeight = vh * 0.4;
        const scaleByWidth = maxWidth / bigWin.texture.width;
        const scaleByHeight = maxHeight / bigWin.texture.height;
        bigWinTargetScale = Math.min(scaleByWidth, scaleByHeight);
      } else {
        const maxWidth = vw * 0.8;
        const maxHeight = vh * 0.6;
        const scaleByWidth = maxWidth / bigWin.texture.width;
        const scaleByHeight = maxHeight / bigWin.texture.height;
        bigWinTargetScale = Math.min(scaleByWidth, scaleByHeight);
      }
      
      const coinsAnim = packshotElements['coinsAnim'];
      
      if (coinsAnim) {
        if (isLandscape) {
          coinsAnim.y = bigWin.y + (bigWin.texture.height * bigWinTargetScale) * -0.8;
        } else {
          coinsAnim.y = bigWin.y + (bigWin.texture.height * bigWinTargetScale) * -1.2;
        }
      }
      
      const animationPromises = [
        tweenScale(app, bigWin, 0, bigWinTargetScale, 400)
      ];
      
      if (coinsAnim) {
        coinsAnim.play();
        animationPromises.push(tweenValue(app, coinsAnim, "alpha", 0, 1, 400));
      }
      
      // Звук отключен
      // playSound('bigWin', 0.7);
      
      await Promise.all(animationPromises);
      
      // Задержка после анимации BIGWin и coinsAnim (без SMS)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await tweenValue(app, bgDark2, "alpha", 0, 1, 300);
      
      const phoneTargetX = vw / 2;
      const phoneTargetY = vh / 2;
      
      await tweenPosition(app, phone, { x: phoneTargetX, y: phoneTargetY }, 500);
      
      const phoneTextures = await loadPhoneTextures();
      
      if (phoneTextures.length > 0) {
        const phoneAnim = new PIXI.AnimatedSprite(phoneTextures);
        phoneAnim.anchor.set(0.5);
        phoneAnim.x = vw / 2;
        phoneAnim.y = vh / 2;
        
        if (isLandscape) {
          const maxWidth = vw * 0.5;
          const maxHeight = vh * 0.7;
          const scaleByWidth = maxWidth / phoneAnim.texture.width;
          const scaleByHeight = maxHeight / phoneAnim.texture.height;
          const phoneTargetScale = Math.min(scaleByWidth, scaleByHeight) * 1.3;
          phoneAnim.scale.set(phoneTargetScale);
        } else {
          const maxWidth = vw * 0.6;
          const maxHeight = vh * 0.8;
          const scaleByWidth = maxWidth / phoneAnim.texture.width;
          const scaleByHeight = maxHeight / phoneAnim.texture.height;
          const phoneTargetScale = Math.min(scaleByWidth, scaleByHeight) * 1.3;
          phoneAnim.scale.set(phoneTargetScale);
        }
        
        phoneAnim.loop = false;
        phoneAnim.animationSpeed = 0.5;
        phoneAnim.zIndex = 17;
        phoneAnim.name = 'phoneAnim';
        
        packshotOverlay.removeChild(phone);
        delete packshotElements['phone'];
        packshotOverlay.addChild(phoneAnim);
        packshotElements['phoneAnim'] = phoneAnim;
        
        phoneAnim.play();
        
        // Звуки отключены
        /*
        for (let i = 0; i < 5; i++) {
          playSound('buttonClick', 0.5);
          if (i < 4) {
            await new Promise(resolve => setTimeout(resolve, 350));
          }
        }
        */
        
        await new Promise(r => setTimeout(r, 2200));
        
        if (phoneAnim.parent) {
          packshotOverlay.removeChild(phoneAnim);
          delete packshotElements['phoneAnim'];
        }
      }
      
      await showFinalPackshot(app, packshotOverlay, vw, vh);
    }
    
    function initPackshotWatcher(app, getState) {
      let watcherStarted = false;
      const check = () => {
        if (watcherStarted) return;
        const st = getState();
        if (st.ballsReleased >= st.MAX_BALLS && st.activeBalls.length === 0) {
          watcherStarted = true;
          startPackshotSequence(app).catch(err => {
            console.error("Packshot sequence error:", err);
          });
        }
      };
      app.ticker.add(check);
    }

    // Аудио инициализация отключена
    // initAudio();

    app.ticker.add(() => {
      animateBalance();
      updateBasketAnimations();
      
      if (handSprite && handSprite.visible) {
        const time = app.ticker.lastTime/1.6 ;
        const pulseScale = 0.12 + Math.sin(time * 3) * 0.01;
        handSprite.scale.set(pulseScale);
      }
    });

    initPackshotWatcher(app, getState);

    app.start();
    
  } catch (error) {
    console.error('Ошибка при запуске игры:', error);
    
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 0, 0, 0.8);
      color: white;
      padding: 20px;
      border-radius: 10px;
      font-family: Arial, sans-serif;
      z-index: 1000;
      max-width: 80%;
      text-align: center;
    `;
    errorDiv.innerHTML = `
      <h3>Ошибка при запуске игры</h3>
      <p>${error.message}</p>
      <p>Пожалуйста, обновите страницу или проверьте консоль для подробностей.</p>
    `;
    document.body.appendChild(errorDiv);
  }
});