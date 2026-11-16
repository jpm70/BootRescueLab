/**
 * BootRescueLab — GhostAcademy
 * Fase 1: Interfaz educativa de dos paneles, visualizador de disco y motor base de terminal.
 * Aplicación 100% cliente-estática (Vanilla JS ES Module) preparada para GitHub Pages.
 */

/** @typedef {'winpe' | 'grub'} TerminalTheme */
/** @typedef {'ok' | 'warning' | 'damaged'} HealthState */

/**
 * @typedef {Object} BootStructure
 * @property {string} id
 * @property {string} name
 * @property {string} role
 * @property {HealthState} status
 * @property {string} statusLabel
 * @property {string} detail
 */

/**
 * @typedef {Object} DiskPartition
 * @property {string} id
 * @property {string} code
 * @property {string} label
 * @property {string} fs
 * @property {string} size
 * @property {number} visualWeight
 * @property {string} lbaRange
 * @property {string} flags
 * @property {HealthState} status
 * @property {string} statusLabel
 * @property {string} diagnosis
 */

/**
 * @typedef {Object} Scenario
 * @property {string} id
 * @property {string} ticketId
 * @property {string} shortLabel
 * @property {string} title
 * @property {TerminalTheme} theme
 * @property {string} envName
 * @property {string} prompt
 * @property {string} windowTitle
 * @property {string} firmware
 * @property {string} partitionScheme
 * @property {string} errorCode
 * @property {string} hardwareMeta
 * @property {string} totalLba
 * @property {string} summary
 * @property {string} symptom
 * @property {string} objective
 * @property {string[]} bootBanner
 * @property {BootStructure[]} bootStructures
 * @property {DiskPartition[]} partitions
 * @property {string} flag
 * @property {string} victorySummary
 * @property {string[]} hints
 */

/** @type {Scenario[]} */
const SCENARIOS = [
  {
    id: 'winpe-mbr-corrupt',
    ticketId: 'CASO 1 · BRL-101',
    shortLabel: 'Caso 1 · MBR Corrupto',
    title: 'MBR Corrupto (Windows)',
    theme: 'winpe',
    envName: 'Windows PE',
    prompt: 'X:\\Sources>',
    windowTitle: 'Administrador: X:\\windows\\system32\\cmd.exe — Windows PE',
    firmware: 'BIOS Legacy / MBR',
    partitionScheme: 'MBR (Master Boot Record)',
    errorCode: 'Operating System not found',
    hardwareMeta: 'Disco 0 · 500 GB SATA SSD · 976.773.168 sectores',
    totalLba: 'LBA 976.773.167',
    summary:
      'El equipo sufrió una pérdida de suministro eléctrico. La partición de Windows (C:) permanece intacta, pero el Sector 0 (MBR) quedó corrupto e impide que la BIOS transfiera el control al cargador.',
    symptom:
      'Pantalla negra al encender el equipo con el mensaje "Operating System not found".',
    objective:
      'Repara el registro maestro de arranque ejecutando bootrec /fixmbr (y opcionalmente /fixboot para reforzar el sector de arranque del volumen).',
    flag: 'GHOST{mbr_b00tstr4p_r3st0r3d_0x55aa}',
    victorySummary:
      'Has reescrito el código maestro de arranque en el Sector 0 del Disco 0. La BIOS vuelve a localizar la partición activa de Windows.',
    hints: [
      'Observa el Visualizador de Disco: la partición Windows (C:) está íntegra, pero el fallo está en el Sector 0 (MBR).',
      'En entornos Windows PE basados en BIOS/MBR, la herramienta estándar para restaurar el código maestro de arranque es bootrec.',
      'Ejecuta bootrec /fixmbr en la consola (y opcionalmente bootrec /fixboot).',
    ],
    bootBanner: [
      'Microsoft Windows [Versión 10.0.22621.1]',
      '(c) Microsoft Corporation. Todos los derechos reservados.',
      '',
      '[Entorno de recuperación de Windows PE cargado en RAMDisk X:\\]',
      'Caso 1 activo: MBR Corrupto. Escribe "help" para ver los comandos disponibles.',
    ],
    bootStructures: [
      {
        id: 'mbr-sector-0',
        name: 'Sector 0 (MBR)',
        role: 'Código de arranque maestro + Tabla de 4 particiones',
        status: 'damaged',
        statusLabel: 'Corrupto',
        detail:
          'Firma 0x55AA dañada y código bootstrap (primeros 446 bytes) truncado tras el corte eléctrico.',
      },
      {
        id: 'pbr-ntfs',
        name: 'PBR + Almacén BCD',
        role: 'Boot Configuration Data en partición reservada',
        status: 'warning',
        statusLabel: 'Inaccesible',
        detail:
          'El volumen "Reservado para el sistema" conserva sus archivos NTFS, pero la cadena BIOS -> MBR no logra transferirle el control.',
      },
    ],
    partitions: [
      {
        id: 'part-mbr-sys',
        code: 'P1',
        label: 'Reservado para el sistema',
        fs: 'NTFS',
        size: '549 MB',
        visualWeight: 18,
        lbaRange: '2048 – 1.126.399',
        flags: 'Activa (Boot), Primaria',
        status: 'warning',
        statusLabel: 'Advertencia',
        diagnosis:
          'Partición activa marcada correctamente, aunque no recibe el salto de ejecución desde el Sector 0 dañado.',
      },
      {
        id: 'part-mbr-c',
        code: 'P2',
        label: 'Windows (C:)',
        fs: 'NTFS',
        size: '465,2 GB',
        visualWeight: 66,
        lbaRange: '1.126.400 – 975.605.759',
        flags: 'Primaria',
        status: 'ok',
        statusLabel: 'Íntegro',
        diagnosis:
          'Sistema de archivos NTFS consistente. Los archivos de \\Windows\\System32 permanecen intactos.',
      },
      {
        id: 'part-mbr-rec',
        code: 'P3',
        label: 'WinRE Recovery',
        fs: 'NTFS',
        size: '568 MB',
        visualWeight: 16,
        lbaRange: '975.605.760 – 976.769.023',
        flags: 'Oculta (ID 27)',
        status: 'ok',
        statusLabel: 'Íntegro',
        diagnosis:
          'Imagen de recuperación WinRE.wim disponible y legible desde el entorno de rescate.',
      },
    ],
  },
  {
    id: 'winpe-efi-bcd',
    ticketId: 'CASO 2 · BRL-102',
    shortLabel: 'Caso 2 · EFI Dañada',
    title: 'EFI de Windows Dañada',
    theme: 'winpe',
    envName: 'Windows PE',
    prompt: 'X:\\Sources>',
    windowTitle: 'Administrador: X:\\windows\\system32\\cmd.exe — Windows PE',
    firmware: 'UEFI / GPT',
    partitionScheme: 'GPT (GUID Partition Table)',
    errorCode: '0xc0000098',
    hardwareMeta: 'Disco 0 · 1 TB NVMe PCIe · 1.953.525.168 sectores',
    totalLba: 'LBA 1.953.525.167',
    summary:
      'Disco GPT con partición de Windows (C:) intacta, pero la partición EFI System (ESP) está vacía o contiene un almacén BCD corrupto que impide iniciar winload.efi.',
    symptom:
      'Pantallazo azul de recuperación: "0xc0000098 - The Boot Configuration Data file doesn\'t contain valid information".',
    objective:
      'Usa diskpart para asignar una letra a la partición EFI (select vol / assign letter) y repara el arranque mediante bcdboot C:\\Windows o bootrec /rebuildbcd.',
    flag: 'GHOST{u3f1_bcd_st0r3_r3bu1lt_0xc0000098}',
    victorySummary:
      'Has regenerado los archivos de arranque UEFI y el almacén BCD en la partición EFI (FAT32). El gestor de Windows vuelve a iniciar correctamente.',
    hints: [
      'Comprueba el almacén con bcdedit y verás que el BCD está dañado (0xc0000098).',
      'Entra en diskpart, ejecuta list vol, selecciona el volumen FAT32 de 260 MB (select vol 0) y asígnale una letra (assign letter=S). Luego sal con exit.',
      'Reconstruye los archivos UEFI con bcdboot C:\\Windows /s S: /f UEFI (o directamente bcdboot C:\\Windows / bootrec /rebuildbcd).',
    ],
    bootBanner: [
      'Microsoft Windows [Versión 10.0.22621.1]',
      '(c) Microsoft Corporation. Todos los derechos reservados.',
      '',
      '[Entorno de recuperación de Windows PE cargado en RAMDisk X:\\]',
      'Caso 2 activo: EFI de Windows Dañada. Escribe "help" para ver los comandos disponibles.',
    ],
    bootStructures: [
      {
        id: 'gpt-header',
        name: 'Cabecera GPT (LBA 1–33)',
        role: 'Tabla GUID primaria y CRC32 de respaldo',
        status: 'ok',
        statusLabel: 'Íntegro',
        detail:
          'Protective MBR en LBA 0 y tabla de particiones GPT verificadas con suma de comprobación CRC32 correcta.',
      },
      {
        id: 'efi-bcd',
        name: 'EFI\\Microsoft\\Boot\\BCD',
        role: 'Registro de entradas de arranque UEFI',
        status: 'damaged',
        statusLabel: 'Dañado',
        detail:
          'La partición EFI carece de un almacén BCD válido (error 0xc0000098); \\EFI\\Boot\\bootx64.efi no logra lanzar winload.efi.',
      },
    ],
    partitions: [
      {
        id: 'part-gpt-esp',
        code: 'P1',
        label: 'EFI System (ESP)',
        fs: 'FAT32',
        size: '260 MB',
        visualWeight: 18,
        lbaRange: '2048 – 534.527',
        flags: 'esp, boot',
        status: 'damaged',
        statusLabel: 'Corrupto',
        diagnosis:
          'Partición EFI vacía o con almacén \\EFI\\Microsoft\\Boot\\BCD corrupto. Necesita reconstrucción mediante bcdboot o bootrec /rebuildbcd.',
      },
      {
        id: 'part-gpt-msr',
        code: 'P2',
        label: 'Microsoft Reserved',
        fs: 'MSR (Sin FS)',
        size: '16 MB',
        visualWeight: 12,
        lbaRange: '534.528 – 567.295',
        flags: 'msftres',
        status: 'ok',
        statusLabel: 'Íntegro',
        diagnosis: 'Partición reservada GPT sin anomalías estructurales.',
      },
      {
        id: 'part-gpt-os',
        code: 'P3',
        label: 'Windows System (C:)',
        fs: 'NTFS',
        size: '930,4 GB',
        visualWeight: 56,
        lbaRange: '567.296 – 1.951.801.343',
        flags: 'msftdata',
        status: 'ok',
        statusLabel: 'Íntegro',
        diagnosis:
          'Volumen principal NTFS íntegro. Archivo \\Windows\\System32\\winload.efi presente.',
      },
      {
        id: 'part-gpt-rec',
        code: 'P4',
        label: 'Recovery Tools',
        fs: 'NTFS',
        size: '840 MB',
        visualWeight: 14,
        lbaRange: '1.951.801.344 – 1.953.523.199',
        flags: 'hidden, diag',
        status: 'ok',
        statusLabel: 'Íntegro',
        diagnosis: 'Partición de diagnóstico OEM intacta.',
      },
    ],
  },
  {
    id: 'grub-dualboot-broken',
    ticketId: 'CASO 3 · BRL-201',
    shortLabel: 'Caso 3 · Dual Boot GRUB',
    title: 'Dual Boot Pisado (GRUB Error)',
    theme: 'grub',
    envName: 'GRUB Rescue',
    prompt: 'grub rescue>',
    windowTitle: 'GNU GRUB version 2.06 — Rescue Shell',
    firmware: 'BIOS Legacy / MBR',
    partitionScheme: 'MBR (Master Boot Record)',
    errorCode: 'error: no such partition',
    hardwareMeta: 'Disco 0 · 250 GB SATA · 488.397.168 sectores',
    totalLba: 'LBA 488.397.167',
    summary:
      'Tras reinstalar Windows en la primera partición, la partición auxiliar (hd0,msdos3) fue eliminada y la tabla MBR cambió. Las variables prefix y root de GRUB apuntan a (hd0,msdos3), mientras que /boot/grub se encuentra en (hd0,msdos2).',
    symptom:
      'Tras reinstalar Windows, GRUB se detiene en grub rescue> mostrando "error: no such partition. Entering rescue mode...".',
    objective:
      'Usa ls para localizar la partición ext4 correcta (hd0,msdos2), configura set root y set prefix, carga insmod normal y ejecuta normal.',
    flag: 'GHOST{grub_n0rm4l_m0d_msd0s2_pwn3d}',
    victorySummary:
      'Has reconfigurado root y prefix hacia (hd0,msdos2)/boot/grub, cargado el módulo normal.mod y restaurado el menú de arranque dual GNU GRUB.',
    hints: [
      'Ejecuta ls y set para comparar qué particiones existen frente a adónde apuntan root y prefix.',
      'Inspecciona con ls (hd0,msdos2)/boot/grub para confirmar que ahí están los módulos (i386-pc/) y grub.cfg.',
      'Ejecuta en orden: set root=(hd0,msdos2), set prefix=(hd0,msdos2)/boot/grub, insmod normal y finalmente normal.',
    ],
    bootBanner: [
      'GNU GRUB  version 2.06',
      '',
      'error: no such partition.',
      'Entering rescue mode...',
      'Caso 3 activo: Dual Boot Pisado. Escribe "help" para consultar los comandos de GRUB Rescue.',
    ],
    bootStructures: [
      {
        id: 'grub-mbr-gap',
        name: 'MBR + Post-MBR Gap (LBA 1–2047)',
        role: 'boot.img (Stage 1) y core.img (Stage 1.5)',
        status: 'ok',
        statusLabel: 'Íntegro',
        detail:
          'Stage 1 y core.img cargan tras la reinstalación, pero buscan los módulos Stage 2 en la partición eliminada (hd0,msdos3).',
      },
      {
        id: 'grub-prefix',
        name: 'Prefijo & Módulos GRUB',
        role: 'Ubicación de i386-pc/normal.mod y grub.cfg',
        status: 'damaged',
        statusLabel: 'Desincronizado',
        detail:
          'Las variables iniciales apuntan a (hd0,msdos3)/boot/grub (borrada), cuando la carpeta /boot/grub real está en (hd0,msdos2).',
      },
    ],
    partitions: [
      {
        id: 'part-dual-win',
        code: 'msdos1',
        label: 'Windows Reinstalado',
        fs: 'NTFS',
        size: '120 GB',
        visualWeight: 46,
        lbaRange: '2048 – 251.660.287',
        flags: 'Primaria',
        status: 'ok',
        statusLabel: 'Íntegro',
        diagnosis: 'Partición NTFS donde se reinstaló Windows recientemente.',
      },
      {
        id: 'part-dual-boot',
        code: 'msdos2',
        label: 'Linux /boot + Root (/)',
        fs: 'ext4',
        size: '112 GB',
        visualWeight: 40,
        lbaRange: '251.660.288 – 486.494.207',
        flags: 'Primaria, Boot',
        status: 'damaged',
        statusLabel: 'Desvinculada',
        diagnosis:
          'Partición ext4 íntegra que contiene /boot/grub/i386-pc/normal.mod, vmlinuz e initrd.img. Debe enlazarse con set root y set prefix.',
      },
      {
        id: 'part-dual-deleted',
        code: 'borrada',
        label: 'Antigua msdos3 (Borrada)',
        fs: 'Sin formato',
        size: '16 GB',
        visualWeight: 14,
        lbaRange: '486.494.208 – 488.394.751',
        flags: 'Eliminada',
        status: 'warning',
        statusLabel: 'Eliminada',
        diagnosis:
          'Antigua partición (hd0,msdos3) eliminada durante el particionado; GRUB todavía la tiene grabada en $root y $prefix.',
      },
    ],
  },
];

/**
 * @typedef {Object} DiskVolume
 * @property {number} volIndex
 * @property {string} partitionId
 * @property {string} letter
 * @property {string} label
 * @property {string} fs
 * @property {string} type
 * @property {string} size
 * @property {string} info
 * @property {'efi' | 'system-reserved' | 'os' | 'recovery' | 'msr' | 'other'} role
 */

/**
 * @typedef {Object} GrubPartitionEntry
 * @property {string} deviceId
 * @property {string} partitionId
 * @property {'ext4' | 'fat32' | 'ntfs' | 'swap'} fsType
 * @property {boolean} hasBootGrub
 * @property {string} label
 */

/**
 * @typedef {Object} GrubGlobalState
 * @property {string} root
 * @property {string} prefix
 * @property {string} cmdpath
 * @property {string} validBootDevice
 * @property {string} archDir
 * @property {string} distroName
 * @property {string} kernelVersion
 * @property {boolean} normalLoaded
 * @property {boolean} booted
 * @property {Record<string, string>} extraVars
 * @property {GrubPartitionEntry[]} devices
 */

/**
 * @typedef {Object} GlobalDiskState
 * @property {number} diskNumber
 * @property {string} model
 * @property {string} size
 * @property {string} free
 * @property {boolean} isGpt
 * @property {string} status
 * @property {number | null} selectedDisk
 * @property {number | null} selectedVolume
 * @property {BootStructure[]} bootStructures
 * @property {DiskPartition[]} partitions
 * @property {DiskVolume[]} volumes
 * @property {{
 *   mbrHealthy: boolean,
 *   bootSectorHealthy: boolean,
 *   bcdHealthy: boolean,
 *   efiHealthy: boolean,
 *   bcdEntriesRebuilt: boolean,
 *   osDetectedPath: string,
 *   firmwareMode: 'BIOS' | 'UEFI'
 * }} boot
 * @property {GrubGlobalState} grub
 * @property {boolean} solved
 */

/**
 * @typedef {Object} SolvedRecord
 * @property {string} flag
 * @property {number} score
 * @property {number} commandsUsed
 */

/**
 * Carga y guarda el progreso CTF en localStorage de forma segura.
 * @returns {Record<string, SolvedRecord>}
 */
function loadSavedProgress() {
  try {
    const raw = localStorage.getItem('bootrescuelab_progress_v1');
    if (!raw) return {};
    return sanitizeSavedProgress(JSON.parse(raw));
  } catch {
    return {};
  }
}

/**
 * Solo acepta casos que existen y cuya flag es la del propio caso: antes cualquier clave
 * o bandera inventada en localStorage contaba como resuelta (p. ej. «3 / 3» sin jugar).
 * @param {unknown} parsed
 * @returns {Record<string, SolvedRecord>}
 */
function sanitizeSavedProgress(parsed) {
  /** @type {Record<string, SolvedRecord>} */
  const clean = {};
  if (!parsed || typeof parsed !== 'object') return clean;
  SCENARIOS.forEach((scenario) => {
    const record = /** @type {Record<string, unknown>} */ (parsed)[scenario.id];
    if (!record || typeof record !== 'object' || record.flag !== scenario.flag) return;
    const score = Number(record.score);
    const commandsUsed = Number(record.commandsUsed);
    clean[scenario.id] = {
      flag: scenario.flag,
      score: Number.isFinite(score) ? Math.min(1000, Math.max(500, Math.round(score))) : 500,
      commandsUsed: Number.isFinite(commandsUsed) ? Math.max(0, Math.round(commandsUsed)) : 0,
    };
  });
  return clean;
}

/**
 * @param {Record<string, SolvedRecord>} records
 */
function saveProgress(records) {
  try {
    localStorage.setItem('bootrescuelab_progress_v1', JSON.stringify(records));
  } catch {
    // Ignorar si almacenamiento local no está disponible
  }
}

/**
 * Estado global de la aplicación y representación mutable del Disco 0.
 */
const state = {
  currentScenarioId: SCENARIOS[0].id,
  selectedPartitionId: SCENARIOS[0].partitions[0].id,
  /** @type {string | null} */
  selectedStructureId: null,
  /** @type {GlobalDiskState | null} */
  disk: null,
  commandCount: 0,
  errorCount: 0,
  hintsRevealed: 0,
  /** @type {Record<string, SolvedRecord>} */
  solvedScenarios: loadSavedProgress(),
  /** @type {Record<string, HealthState>} */
  lastHealthMap: {},
};

/**
 * Motor sutil de efectos de sonido 100% cliente mediante Web Audio API (sin archivos externos).
 */
class SoundEngine {
  constructor() {
    this.enabled = this.loadPreference();
    /** @type {AudioContext | null} */
    this.ctx = null;
  }

  loadPreference() {
    try {
      const saved = localStorage.getItem('bootrescuelab_sound');
      return saved === null ? true : saved === '1';
    } catch {
      return true;
    }
  }

  savePreference() {
    try {
      localStorage.setItem('bootrescuelab_sound', this.enabled ? '1' : '0');
    } catch {
      // Ignorar si almacenamiento local no está disponible
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    this.savePreference();
    if (this.enabled) {
      this.playKey();
    }
    return this.enabled;
  }

  /** @returns {AudioContext | null} */
  getContext() {
    if (!this.enabled || typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || /** @type {typeof AudioContext | undefined} */ (/** @type {any} */ (window).webkitAudioContext);
    if (!AudioCtx) return null;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playKey() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const baseFreq = 680 + Math.random() * 140;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.018);

      gain.gain.setValueAtTime(0.018, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.022);
    } catch {
      // Ignorar errores de audio
    }
  }

  playSuccess() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.07;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.032, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.15);
      });
    } catch {
      // Ignorar errores de audio
    }
  }

  playVictory() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.08;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.036, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.24);
      });
    } catch {
      // Ignorar errores de audio
    }
  }

  playError() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(195, now);
      osc.frequency.linearRampToValueAtTime(135, now + 0.11);

      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    } catch {
      // Ignorar errores de audio
    }
  }
}

const soundFX = new SoundEngine();

/**
 * Construye una copia mutable del estado del Disco 0 a partir del escenario seleccionado.
 * @param {Scenario} scenario
 * @returns {GlobalDiskState}
 */
function createDiskStateFromScenario(scenario) {
  const isGpt = scenario.partitionScheme.toUpperCase().includes('GPT');
  const isWinEfiScenario = scenario.id === 'winpe-efi-bcd';
  const isWinMbrScenario = scenario.id === 'winpe-mbr-corrupt';

  /** @type {BootStructure[]} */
  const bootStructures = scenario.bootStructures.map((item) => ({ ...item }));
  /** @type {DiskPartition[]} */
  const partitions = scenario.partitions.map((item) => ({ ...item }));

  /** @type {DiskVolume[]} */
  const volumes = [];
  let volCounter = 0;

  partitions.forEach((part) => {
    if (part.fs.startsWith('MSR') || part.fs === 'Sin formato') {
      return;
    }

    /** @type {DiskVolume['role']} */
    let role = 'other';
    let letter = '';
    let info = '';

    if (part.id.includes('esp')) {
      role = 'efi';
      info = 'Sistema';
    } else if (part.id.includes('sys')) {
      role = 'system-reserved';
      info = 'Sistema';
    } else if (part.id.includes('os') || part.id.includes('-c') || part.id.includes('win')) {
      role = 'os';
      letter = 'C';
      info = 'Arranque';
    } else if (part.id.includes('rec')) {
      role = 'recovery';
      info = 'Oculto';
    }

    volumes.push({
      volIndex: volCounter,
      partitionId: part.id,
      letter,
      label: part.label.replace(/\s*\(C:\)/i, ''),
      fs: part.fs,
      type: 'Partición',
      size: part.size,
      info,
      role,
    });
    volCounter += 1;
  });

  return {
    diskNumber: 0,
    model: scenario.hardwareMeta.split('·')[1]?.trim() || 'SATA/NVMe SSD',
    size: isWinEfiScenario ? '931 GB' : isWinMbrScenario ? '465 GB' : '500 GB',
    free: '0 B',
    isGpt,
    status: 'En línea',
    selectedDisk: null,
    selectedVolume: null,
    bootStructures,
    partitions,
    volumes,
    boot: {
      mbrHealthy: !isWinMbrScenario,
      bootSectorHealthy: !isWinMbrScenario && !isWinEfiScenario,
      bcdHealthy: !isWinEfiScenario,
      efiHealthy: !isWinEfiScenario,
      bcdEntriesRebuilt: !isWinEfiScenario && !isWinMbrScenario,
      osDetectedPath: 'C:\\Windows',
      firmwareMode: isGpt ? 'UEFI' : 'BIOS',
    },
    grub: createGrubStateFromScenario(scenario, partitions),
    solved: false,
  };
}

/**
 * Inicializa el estado global simulado de GRUB Rescue (partición ext4 con /boot/grub y variables).
 * @param {Scenario} scenario
 * @param {DiskPartition[]} partitions
 * @returns {GrubGlobalState}
 */
function createGrubStateFromScenario(scenario, partitions) {
  /** @type {GrubPartitionEntry[]} */
  const devices = [];

  partitions.forEach((part) => {
    if (
      part.code === 'Libre' ||
      part.code === 'borrada' ||
      part.fs === 'Sin formato' ||
      part.fs.startsWith('MSR')
    ) {
      return;
    }
    const deviceId = `hd0,${part.code}`;
    const fsLower = part.fs.toLowerCase();
    /** @type {GrubPartitionEntry['fsType']} */
    const fsType = fsLower.includes('ext4')
      ? 'ext4'
      : fsLower.includes('fat32')
        ? 'fat32'
        : fsLower.includes('ntfs')
          ? 'ntfs'
          : 'swap';

    const hasBootGrub =
      scenario.id === 'grub-dualboot-broken' && part.code === 'msdos2';

    devices.push({
      deviceId,
      partitionId: part.id,
      fsType,
      hasBootGrub,
      label: part.label,
    });
  });

  return {
    root: 'hd0,msdos3',
    prefix: '(hd0,msdos3)/boot/grub',
    cmdpath: '(hd0)',
    validBootDevice: 'hd0,msdos2',
    archDir: 'i386-pc',
    distroName: 'Ubuntu / Linux Dual-Boot (ext4)',
    kernelVersion: '6.8.0-45-generic',
    normalLoaded: false,
    booted: false,
    extraVars: {},
    devices,
  };
}

/**
 * Normaliza un identificador de dispositivo GRUB (ej. "(hd0,msdos2)" -> "hd0,msdos2").
 * @param {string} rawDevice
 */
function normalizeGrubDevice(rawDevice) {
  return rawDevice.trim().replace(/^\(/, '').replace(/\)$/, '').toLowerCase();
}

/**
 * Comprueba si root y prefix del estado GRUB apuntan correctamente a la partición ext4 con /boot/grub.
 * @param {GrubGlobalState} grub
 */
function isGrubEnvConfiguredCorrectly(grub) {
  const normRoot = normalizeGrubDevice(grub.root);
  if (normRoot !== grub.validBootDevice) return false;

  const prefixMatch = grub.prefix.trim().match(/^\(([^)]+)\)(\/.*)$/);
  if (!prefixMatch) return false;

  const prefixDevice = prefixMatch[1].toLowerCase();
  const prefixPath = prefixMatch[2].replace(/\/+$/, '').toLowerCase();

  if (prefixDevice !== grub.validBootDevice) return false;

  return (
    prefixPath === '/boot/grub' ||
    prefixPath === `/boot/grub/${grub.archDir.toLowerCase()}`
  );
}

/**
 * Sincroniza las estructuras visuales del panel izquierdo con las mutaciones del estado global del Disco 0.
 */
function syncVisualsFromDiskState() {
  if (!state.disk) return;
  const d = state.disk;

  if (state.currentScenarioId === 'winpe-mbr-corrupt') {
    const mbrStruct = d.bootStructures.find((b) => b.id === 'mbr-sector-0');
    if (mbrStruct) {
      mbrStruct.status = d.boot.mbrHealthy ? 'ok' : 'damaged';
      mbrStruct.statusLabel = d.boot.mbrHealthy ? 'Íntegro' : 'Corrupto';
      mbrStruct.detail = d.boot.mbrHealthy
        ? 'Código maestro de arranque (446 bytes) reescrito correctamente mediante bootrec /fixmbr. Firma 0x55AA válida.'
        : 'Firma 0x55AA presente, pero el código bootstrap (primeros 446 bytes) contiene sectores truncados tras el corte eléctrico.';
    }

    const pbrStruct = d.bootStructures.find((b) => b.id === 'pbr-ntfs');
    if (pbrStruct) {
      const pbrReady = d.boot.mbrHealthy && d.boot.bcdHealthy;
      pbrStruct.status = pbrReady ? 'ok' : 'warning';
      pbrStruct.statusLabel =
        pbrReady && d.boot.bootSectorHealthy
          ? 'Íntegro'
          : pbrReady
            ? 'Operativo'
            : 'Inaccesible';
      pbrStruct.detail = pbrReady
        ? 'La cadena BIOS -> MBR vuelve a transferir el control al volumen reservado de Windows.'
        : 'El volumen "Reservado para el sistema" conserva sus archivos NTFS, pero la cadena BIOS -> MBR no logra transferirle el control.';
    }

    const sysPart = d.partitions.find((p) => p.id === 'part-mbr-sys');
    if (sysPart) {
      const sysOk = d.boot.mbrHealthy;
      sysPart.status = sysOk ? 'ok' : 'warning';
      sysPart.statusLabel = sysOk ? 'Íntegro' : 'Advertencia';
      sysPart.diagnosis = sysOk
        ? d.boot.bootSectorHealthy
          ? 'MBR y sector de arranque NTFS reparados; partición activa lista para cargar \\Boot\\BCD y winload.exe.'
          : 'MBR reparado y partición activa accesible. Opcionalmente puedes ejecutar bootrec /fixboot.'
        : 'Partición activa marcada correctamente, aunque no recibe el salto de ejecución desde el Sector 0 dañado.';
    }
  }

  if (state.currentScenarioId === 'winpe-efi-bcd') {
    const efiStruct = d.bootStructures.find((b) => b.id === 'efi-bcd');
    if (efiStruct) {
      const efiReady = d.boot.bcdHealthy && d.boot.efiHealthy;
      efiStruct.status = efiReady ? 'ok' : d.boot.bcdHealthy || d.boot.efiHealthy ? 'warning' : 'damaged';
      efiStruct.statusLabel = efiReady ? 'Íntegro' : d.boot.bcdHealthy ? 'Sector pendiente' : 'Dañado';
      efiStruct.detail = efiReady
        ? 'Almacén \\EFI\\Microsoft\\Boot\\BCD y archivos EFI reconstruidos correctamente para C:\\Windows.'
        : d.boot.bcdHealthy
          ? 'Almacén BCD reconstruido. Puedes ejecutar bootrec /fixboot o bcdboot para asegurar los archivos EFI.'
          : 'La partición EFI carece de un almacén BCD válido (error 0xc0000098); \\EFI\\Boot\\bootx64.efi no logra lanzar winload.efi.';
    }

    const espPart = d.partitions.find((p) => p.id === 'part-gpt-esp');
    if (espPart) {
      const espOk = d.boot.bcdHealthy && d.boot.efiHealthy;
      espPart.status = espOk ? 'ok' : d.boot.bcdHealthy ? 'warning' : 'damaged';
      espPart.statusLabel = espOk ? 'Íntegro' : d.boot.bcdHealthy ? 'Advertencia' : 'Corrupto';
      espPart.diagnosis = espOk
        ? 'Partición EFI (FAT32) reparada con archivos UEFI y entradas BCD válidas apuntando a C:\\Windows.'
        : 'Partición EFI vacía o con almacén \\EFI\\Microsoft\\Boot\\BCD corrupto. Necesita reconstrucción mediante bcdboot o bootrec /rebuildbcd.';
    }
  }

  if (state.currentScenarioId === 'grub-dualboot-broken') {
    const g = d.grub;
    const configured = isGrubEnvConfiguredCorrectly(g);
    const prefixStruct = d.bootStructures.find((b) => b.id === 'grub-prefix');
    if (prefixStruct) {
      prefixStruct.status = g.booted ? 'ok' : g.normalLoaded || configured ? 'warning' : 'damaged';
      prefixStruct.statusLabel = g.booted
        ? 'Arrancado'
        : g.normalLoaded
          ? 'Módulo cargado'
          : configured
            ? 'Ruta lista'
            : 'Desincronizado';
      prefixStruct.detail = g.booted
        ? `Menú GRUB iniciado desde (${g.validBootDevice})/boot/grub y sistema Linux cargado correctamente.`
        : g.normalLoaded
          ? 'Módulo normal.mod cargado desde (hd0,msdos2). Ejecuta "normal" para lanzar el menú de GRUB.'
          : configured
            ? `Variables root=${g.root} y prefix=${g.prefix} configuradas sobre ext4. Ejecuta "insmod normal".`
            : 'Las variables iniciales apuntan a (hd0,msdos3)/boot/grub (borrada), cuando la carpeta /boot/grub real está en (hd0,msdos2).';
    }

    const rootPart = d.partitions.find((p) => p.id === 'part-dual-boot');
    if (rootPart) {
      rootPart.status = g.booted || g.normalLoaded ? 'ok' : configured ? 'warning' : 'damaged';
      rootPart.statusLabel = g.booted
        ? 'Íntegro'
        : g.normalLoaded
          ? 'Montada'
          : configured
            ? 'Enlazada'
            : 'Desvinculada';
      rootPart.diagnosis = g.booted || g.normalLoaded
        ? 'Partición ext4 (hd0,msdos2) montada como raíz de GRUB con /boot/grub/i386-pc/normal.mod cargado.'
        : configured
          ? 'Variables GRUB apuntando a (hd0,msdos2). Lista para ejecutar "insmod normal".'
          : 'Partición ext4 íntegra que contiene /boot/grub/i386-pc/normal.mod, vmlinuz e initrd.img. Debe enlazarse con set root y set prefix.';
    }
  }
}

/**
 * Referencias DOM cacheadas.
 */
const dom = {
  scenarioSelector: document.getElementById('scenario-selector'),
  ctfProgress: document.getElementById('ctf-progress'),
  btnReopenVictory: document.getElementById('btn-reopen-victory'),
  btnResetProgress: document.getElementById('btn-reset-progress'),
  ticketId: document.getElementById('ticket-id'),
  ticketEnv: document.getElementById('ticket-env'),
  ticketFirmware: document.getElementById('ticket-firmware'),
  ticketErrorCode: document.getElementById('ticket-error-code'),
  ticketTitle: document.getElementById('ticket-title'),
  ticketSummary: document.getElementById('ticket-summary'),
  ticketSymptom: document.getElementById('ticket-symptom'),
  ticketObjective: document.getElementById('ticket-objective'),
  btnRevealHint: document.getElementById('btn-reveal-hint'),
  hintList: document.getElementById('hint-list'),
  commandReferenceList: document.getElementById('command-reference-list'),
  diskHardwareMeta: document.getElementById('disk-hardware-meta'),
  diskSchemeLabel: document.getElementById('disk-scheme-label'),
  diskTotalLba: document.getElementById('disk-total-lba'),
  diskOverallStatus: document.getElementById('disk-overall-status'),
  diskBootChain: document.getElementById('disk-boot-chain'),
  diskBootStructures: document.getElementById('disk-boot-structures'),
  diskPartitionBar: document.getElementById('disk-partition-bar'),
  partitionInspector: document.getElementById('partition-inspector'),

  terminalShell: document.getElementById('terminal-shell'),
  terminalWindowTitle: document.getElementById('terminal-window-title'),
  terminalViewport: document.getElementById('terminal-viewport'),
  terminalOutput: document.getElementById('terminal-output'),
  terminalPromptLabel: document.getElementById('terminal-prompt-label'),
  terminalMirrorBefore: document.getElementById('terminal-mirror-before'),
  terminalMirrorAfter: document.getElementById('terminal-mirror-after'),
  terminalInput: document.getElementById('terminal-input'),
  terminalEnvIndicator: document.getElementById('terminal-env-indicator'),
  historyCount: document.getElementById('history-count'),

  btnSoundToggle: document.getElementById('btn-sound-toggle'),
  soundIconOn: document.getElementById('sound-icon-on'),
  soundIconOff: document.getElementById('sound-icon-off'),
  soundToggleLabel: document.getElementById('sound-toggle-label'),
  btnCmdHelp: document.getElementById('btn-cmd-help'),
  btnCmdClear: document.getElementById('btn-cmd-clear'),
  btnTerminalReset: document.getElementById('btn-terminal-reset'),

  victoryModal: document.getElementById('victory-modal'),
  victoryCaseMeta: document.getElementById('victory-case-meta'),
  victorySummary: document.getElementById('victory-summary'),
  victoryFlag: document.getElementById('victory-flag'),
  victoryScore: document.getElementById('victory-score'),
  victoryCommands: document.getElementById('victory-commands'),
  victoryProgress: document.getElementById('victory-progress'),
  btnCopyFlag: document.getElementById('btn-copy-flag'),
  btnVictoryClose: document.getElementById('btn-victory-close'),
  btnVictoryContinue: document.getElementById('btn-victory-continue'),
  btnVictoryNext: document.getElementById('btn-victory-next'),
};

/**
 * Obtiene el escenario activo.
 * @returns {Scenario}
 */
function getCurrentScenario() {
  return SCENARIOS.find((s) => s.id === state.currentScenarioId) || SCENARIOS[0];
}

/**
 * Devuelve clases e icono SVG inline según el estado de salud del sector/partición.
 * Siempre incluye etiqueta textual explícita junto al color (accesibilidad).
 * @param {HealthState} status
 */
function getStatusVisuals(status) {
  if (status === 'damaged') {
    return {
      badgeTextClass: 'text-red-700',
      surfaceClass: 'border-red-400 sector-damaged-pattern sector-alert-pulse text-red-950',
      boxSurfaceClass: 'border-red-400 sector-damaged-pattern sector-alert-pulse text-red-950',
      iconSvg:
        '<svg class="h-3.5 w-3.5 shrink-0 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    };
  }
  if (status === 'warning') {
    return {
      badgeTextClass: 'text-amber-700',
      surfaceClass: 'border-amber-300 sector-warning-pattern text-amber-950',
      boxSurfaceClass: 'border-amber-300 sector-warning-pattern text-amber-950',
      iconSvg:
        '<svg class="h-3.5 w-3.5 shrink-0 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    };
  }
  return {
    badgeTextClass: 'text-emerald-700',
    surfaceClass: 'border-emerald-300 sector-healthy-surface text-emerald-950',
    boxSurfaceClass: 'border-emerald-300 sector-healthy-surface text-emerald-950',
    iconSvg:
      '<svg class="h-3.5 w-3.5 shrink-0 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  };
}

/**
 * Crea nodos DOM seguros sin inyectar HTML de entradas de usuario.
 * @param {string} tag
 * @param {string} className
 * @param {string} textContent
 */
function createEl(tag, className, textContent) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (textContent !== undefined) el.textContent = textContent;
  return el;
}

/**
 * Motor del terminal (manejo de input, historial, scroll automático, comandos base y simulador Windows PE).
 */
class TerminalEngine {
  constructor() {
    /** @type {string[]} */
    this.history = [];
    this.historyIndex = -1;
    this.draftInput = '';
    this.prompt = 'X:\\Sources>';
    /** @type {TerminalTheme} */
    this.theme = 'winpe';
    /** @type {null | 'diskpart' | 'confirm-rebuildbcd'} */
    this.subMode = null;
    this.currentDrive = 'X';
    /** @type {Record<string, string>} */
    this.driveCwds = {
      X: 'X:\\Sources',
      C: 'C:\\',
    };
    this.isRenderingBanner = false;
    this.errorSoundPlayedThisCmd = false;

    this.bindEvents();
  }

  bindEvents() {
    const input = /** @type {HTMLInputElement | null} */ (dom.terminalInput);
    const viewport = dom.terminalViewport;
    const shell = dom.terminalShell;
    if (!input || !viewport || !shell) return;

    // Enfocar input al hacer clic en cualquier parte de la consola
    viewport.addEventListener('click', () => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) return;
      input.focus();
    });

    input.addEventListener('focus', () => {
      shell.classList.add('is-focused');
      this.syncMirror();
    });

    input.addEventListener('blur', () => {
      shell.classList.remove('is-focused');
    });

    input.addEventListener('input', () => {
      if (this.historyIndex !== -1) {
        this.historyIndex = -1;
      }
      this.syncMirror();
      this.scrollToBottom();
    });

    input.addEventListener('keyup', () => this.syncMirror());
    input.addEventListener('click', () => this.syncMirror());

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.execute(input.value);
        input.value = '';
        this.draftInput = '';
        this.historyIndex = -1;
        this.syncMirror();
        this.scrollToBottom();
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.navigateHistory(-1);
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.navigateHistory(1);
        return;
      }

      if (event.key === 'Tab') {
        event.preventDefault();
        this.handleTabAutocomplete(input);
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'l') {
        event.preventDefault();
        this.clearScreen();
        return;
      }

      if (
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        (event.key.length === 1 || event.key === 'Backspace')
      ) {
        soundFX.playKey();
      }
    });

    // Botones auxiliares en la barra superior de la terminal
    if (dom.btnSoundToggle) {
      dom.btnSoundToggle.addEventListener('click', () => {
        soundFX.toggle();
        updateSoundToggleUI();
        input.focus();
      });
    }

    if (dom.btnCmdHelp) {
      dom.btnCmdHelp.addEventListener('click', () => {
        soundFX.playKey();
        this.runQuickCommand('help');
      });
    }

    if (dom.btnCmdClear) {
      dom.btnCmdClear.addEventListener('click', () => {
        soundFX.playKey();
        this.runQuickCommand(this.theme === 'grub' ? 'clear' : 'cls');
      });
    }

    if (dom.btnTerminalReset) {
      dom.btnTerminalReset.addEventListener('click', () => {
        soundFX.playKey();
        selectScenario(state.currentScenarioId);
        input.focus();
      });
    }
  }

  /**
   * Sincroniza el texto visible y la posición del cursor emulado con el input real.
   */
  syncMirror() {
    const input = /** @type {HTMLInputElement | null} */ (dom.terminalInput);
    if (!input || !dom.terminalMirrorBefore || !dom.terminalMirrorAfter) return;

    const val = input.value;
    const pos = typeof input.selectionStart === 'number' ? input.selectionStart : val.length;
    dom.terminalMirrorBefore.textContent = val.slice(0, pos);
    dom.terminalMirrorAfter.textContent = val.slice(pos);
  }

  /**
   * Desplaza automáticamente el contenedor de salida hasta la línea activa.
   */
  scrollToBottom() {
    if (!dom.terminalViewport) return;
    dom.terminalViewport.scrollTop = dom.terminalViewport.scrollHeight;
  }

  /**
   * Navega por el registro del historial con Flecha Arriba / Abajo.
   * @param {-1 | 1} direction
   */
  navigateHistory(direction) {
    const input = /** @type {HTMLInputElement | null} */ (dom.terminalInput);
    if (!input || this.history.length === 0) return;

    if (direction === -1) {
      if (this.historyIndex === -1) {
        this.draftInput = input.value;
        this.historyIndex = this.history.length - 1;
      } else if (this.historyIndex > 0) {
        this.historyIndex -= 1;
      }
      input.value = this.history[this.historyIndex];
    } else if (direction === 1) {
      if (this.historyIndex === -1) return;
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex += 1;
        input.value = this.history[this.historyIndex];
      } else {
        this.historyIndex = -1;
        input.value = this.draftInput;
      }
    }

    const end = input.value.length;
    input.setSelectionRange(end, end);
    this.syncMirror();
    this.scrollToBottom();
  }

  /**
   * Actualiza el texto visible del prompt según el submodo y directorio actual.
   */
  updatePrompt() {
    if (this.theme === 'grub') {
      this.prompt = 'grub rescue>';
    } else if (this.subMode === 'diskpart') {
      this.prompt = 'DISKPART>';
    } else if (this.subMode === 'confirm-rebuildbcd') {
      this.prompt = 'Sí<S>/No<N>/Todo<T>:';
    } else {
      const cwd = this.driveCwds[this.currentDrive] || `${this.currentDrive}:\\`;
      this.prompt = `${cwd}>`;
    }

    if (dom.terminalPromptLabel) {
      dom.terminalPromptLabel.textContent = this.prompt;
    }
  }

  /**
   * Cambia el tema visual y prompt de la terminal según el escenario activo.
   * @param {Scenario} scenario
   * @param {boolean} [keepHistory=false]
   */
  resetForScenario(scenario, keepHistory = false) {
    this.theme = scenario.theme;
    this.subMode = null;
    this.currentDrive = 'X';
    this.driveCwds = {
      X: 'X:\\Sources',
      C: 'C:\\',
    };
    this.updatePrompt();

    if (dom.terminalShell) {
      dom.terminalShell.classList.remove('theme-winpe', 'theme-grub');
      dom.terminalShell.classList.add(scenario.theme === 'grub' ? 'theme-grub' : 'theme-winpe');
    }

    if (dom.terminalWindowTitle) {
      dom.terminalWindowTitle.textContent = scenario.windowTitle;
    }

    if (dom.terminalEnvIndicator) {
      dom.terminalEnvIndicator.textContent = `Entorno: ${scenario.envName}`;
    }

    if (dom.btnCmdClear) {
      dom.btnCmdClear.textContent = scenario.theme === 'grub' ? 'clear' : 'cls';
    }

    if (!keepHistory) {
      this.history = [];
      this.historyIndex = -1;
      this.draftInput = '';
      this.updateHistoryCounter();
    }

    const input = /** @type {HTMLInputElement | null} */ (dom.terminalInput);
    if (input) {
      input.value = '';
      this.syncMirror();
    }

    this.clearScreen();
    this.isRenderingBanner = true;
    scenario.bootBanner.forEach((line, index) => {
      const isError =
        line.toLowerCase().startsWith('error:') || line.toLowerCase().includes('no such');
      const isMuted = line.startsWith('Aviso de sesión:') || line.startsWith('Escribe "help"');
      const styleClass = isError
        ? 'terminal-line-error font-semibold'
        : isMuted
          ? 'terminal-line-muted'
          : index === 0
            ? 'terminal-line-strong'
            : '';
      this.appendLine(line, styleClass);
    });
    this.isRenderingBanner = false;
    this.appendBlankLine();
    this.scrollToBottom();
  }

  /**
   * Ejecuta un comando desde los botones rápidos de la barra superior.
   * @param {string} commandText
   */
  runQuickCommand(commandText) {
    const input = /** @type {HTMLInputElement | null} */ (dom.terminalInput);
    this.execute(commandText);
    if (input) {
      input.value = '';
      this.syncMirror();
      input.focus();
    }
    this.scrollToBottom();
  }

  /**
   * Limpia la salida visible de la consola.
   */
  clearScreen() {
    if (dom.terminalOutput) {
      dom.terminalOutput.innerHTML = '';
    }
    this.scrollToBottom();
  }

  /**
   * Añade una línea de texto plano al historial visual de la consola.
   * @param {string} text
   * @param {string} [extraClass='']
   */
  appendLine(text, extraClass = '') {
    if (!dom.terminalOutput) return;
    if (text === '') {
      this.appendBlankLine();
      return;
    }
    if (!this.isRenderingBanner && !this.errorSoundPlayedThisCmd && extraClass.includes('terminal-line-error')) {
      this.errorSoundPlayedThisCmd = true;
      soundFX.playError();
    }
    const line = createEl('div', extraClass, text);
    dom.terminalOutput.appendChild(line);
  }

  appendBlankLine() {
    if (!dom.terminalOutput) return;
    const spacer = createEl('div', 'h-3', '');
    spacer.setAttribute('aria-hidden', 'true');
    dom.terminalOutput.appendChild(spacer);
  }

  /**
   * Registra la línea introducida por el usuario precedida por el prompt actual.
   * @param {string} rawInput
   */
  appendPromptEcho(rawInput) {
    if (!dom.terminalOutput) return;
    const row = createEl('div', 'flex flex-wrap items-baseline');
    const promptEl = createEl('span', 'terminal-line-prompt mr-2 shrink-0 font-medium', this.prompt);
    const cmdEl = createEl('span', 'terminal-line-strong', rawInput);
    row.appendChild(promptEl);
    row.appendChild(cmdEl);
    dom.terminalOutput.appendChild(row);
  }

  updateHistoryCounter() {
    if (dom.historyCount) {
      dom.historyCount.textContent = String(this.history.length);
    }
  }

  /**
   * Procesa y ejecuta un comando en el motor del terminal.
   * @param {string} rawInput
   */
  execute(rawInput) {
    const trimmed = rawInput.trim();
    this.errorSoundPlayedThisCmd = false;
    soundFX.playKey();
    this.appendPromptEcho(rawInput);

    // Sub-prompt interactivo de bootrec /rebuildbcd
    if (this.subMode === 'confirm-rebuildbcd') {
      this.handleRebuildBcdConfirmation(trimmed);
      return;
    }

    if (!trimmed) {
      return;
    }

    // Guardar en historial evitando duplicar exactamente el último comando seguido
    if (this.history[this.history.length - 1] !== trimmed) {
      this.history.push(trimmed);
      if (this.history.length > 100) {
        this.history.shift();
      }
      this.updateHistoryCounter();
    }

    state.commandCount += 1;

    if (this.theme === 'winpe') {
      if (this.subMode === 'diskpart') {
        this.executeDiskpartCommand(trimmed);
      } else {
        this.executeWindowsCommand(trimmed);
      }
      return;
    }

    this.executeGrubCommand(trimmed);
  }

  /**
   * Procesa comandos en el entorno Linux GRUB Rescue (grub rescue>).
   * @param {string} trimmed
   */
  executeGrubCommand(trimmed) {
    const parts = trimmed.split(/\s+/);
    const rawCmd = parts[0];
    const cmd = rawCmd.toLowerCase();
    const args = parts.slice(1);

    if (cmd === 'cls' || cmd === 'clear') {
      this.clearScreen();
      return;
    }

    if (cmd === 'help' || cmd === '?') {
      this.printHelp();
      return;
    }

    if (cmd === 'history') {
      this.printHistory();
      return;
    }

    if (cmd === 'ls') {
      this.cmdGrubLs(args);
      return;
    }

    if (cmd === 'set') {
      this.cmdGrubSet(trimmed.slice(3).trim());
      return;
    }

    if (cmd === 'insmod') {
      this.cmdGrubInsmod(args);
      return;
    }

    if (cmd === 'normal') {
      this.cmdGrubNormal();
      return;
    }

    if (cmd === 'cat') {
      this.cmdGrubCat(args);
      return;
    }

    if (cmd === 'reboot') {
      this.cmdGrubReboot();
      return;
    }

    this.printUnknownCommand(rawCmd);
  }

  /**
   * Autocompletado inteligente con Tab según entorno y submodo actual.
   * @param {HTMLInputElement} input
   */
  handleTabAutocomplete(input) {
    const raw = input.value;
    const trimmedStart = raw.replace(/^\s+/, '');
    const lower = trimmedStart.toLowerCase();
    /** @type {string[]} */
    let candidates = [];

    if (this.theme === 'winpe') {
      if (this.subMode === 'diskpart') {
        candidates = [
          'list disk',
          'list vol',
          'list part',
          'select disk 0',
          'select vol 0',
          'select vol 1',
          'assign letter=S',
          'remove letter=S',
          'detail disk',
          'detail vol',
          'format fs=fat32 quick',
          'active',
          'exit',
          'help',
        ];
      } else if (lower.startsWith('bootrec ')) {
        candidates = [
          'bootrec /fixmbr',
          'bootrec /fixboot',
          'bootrec /scanos',
          'bootrec /rebuildbcd',
        ];
      } else if (lower.startsWith('bcdboot ')) {
        candidates = ['bcdboot C:\\Windows /s S: /f UEFI', 'bcdboot C:\\Windows'];
      } else if (lower.startsWith('bcdedit ')) {
        candidates = ['bcdedit /enum', 'bcdedit /enum all'];
      } else if (lower.startsWith('chkdsk ')) {
        candidates = ['chkdsk C:', 'chkdsk C: /f'];
      } else {
        candidates = [
          'bootrec',
          'bcdboot',
          'bcdedit',
          'diskpart',
          'chkdsk',
          'dir',
          'cd',
          'type',
          'ver',
          'cls',
          'help',
          'history',
          'exit',
        ];
      }
    } else {
      if (lower.startsWith('set ')) {
        candidates = [
          'set root=(hd0,msdos2)',
          'set prefix=(hd0,msdos2)/boot/grub',
        ];
      } else if (lower.startsWith('ls ')) {
        candidates = [
          'ls (hd0,msdos1)/',
          'ls (hd0,msdos2)/',
          'ls (hd0,msdos2)/boot/grub',
          'ls (hd0,msdos2)/boot/grub/i386-pc',
        ];
      } else if (lower.startsWith('insmod ')) {
        candidates = ['insmod normal', 'insmod linux', 'insmod ext2'];
      } else if (lower.startsWith('cat ')) {
        candidates = ['cat (hd0,msdos2)/boot/grub/grub.cfg'];
      } else {
        candidates = ['ls', 'set', 'insmod', 'normal', 'cat', 'clear', 'help', 'history', 'reboot'];
      }
    }

    const matches = candidates.filter((c) => c.toLowerCase().startsWith(lower));
    if (matches.length === 1) {
      input.value = matches[0];
      soundFX.playKey();
      this.syncMirror();
      this.scrollToBottom();
    } else if (matches.length > 1 && lower.length > 0) {
      // Buscar prefijo común más largo
      let prefix = matches[0];
      for (let i = 1; i < matches.length; i += 1) {
        while (!matches[i].toLowerCase().startsWith(prefix.toLowerCase()) && prefix.length > 0) {
          prefix = prefix.slice(0, -1);
        }
      }
      if (prefix.length > trimmedStart.length) {
        input.value = prefix;
        soundFX.playKey();
        this.syncMirror();
      } else {
        this.appendLine(matches.join('   '), 'terminal-line-muted');
        this.scrollToBottom();
      }
    }
  }

  /**
   * Comando cat de GRUB Rescue para inspeccionar grub.cfg simulado.
   * @param {string[]} args
   */
  cmdGrubCat(args) {
    if (!state.disk) return;
    const g = state.disk.grub;
    const target = (args[0] || '').trim().toLowerCase();
    if (!target) {
      this.appendLine('error: filename expected.', 'terminal-line-error');
      this.appendBlankLine();
      return;
    }
    if (
      target === `(${g.validBootDevice})/boot/grub/grub.cfg` ||
      target === `${g.validBootDevice}/boot/grub/grub.cfg`
    ) {
      this.appendLine('# /boot/grub/grub.cfg (extracto)');
      this.appendLine('set timeout=5');
      this.appendLine("menuentry 'Ubuntu / Linux Dual-Boot (ext4)' {");
      this.appendLine(`  set root='(${g.validBootDevice})'`);
      this.appendLine(`  linux /boot/vmlinuz-${g.kernelVersion} root=/dev/sda2 ro quiet splash`);
      this.appendLine(`  initrd /boot/initrd.img-${g.kernelVersion}`);
      this.appendLine('}');
      this.appendBlankLine();
      return;
    }
    this.appendLine(`error: file \`${args[0]}' not found.`, 'terminal-line-error');
    this.appendBlankLine();
  }

  cmdGrubReboot() {
    if (!state.disk) return;
    if (state.disk.grub.booted) {
      this.appendLine('Reiniciando sistema... El gestor GNU GRUB se encuentra reparado.');
      this.appendBlankLine();
      return;
    }
    selectScenario(state.currentScenarioId);
  }

  /**
   * Comando ls de GRUB Rescue: lista particiones o inspecciona directorios/archivos simulados.
   * @param {string[]} args
   */
  cmdGrubLs(args) {
    if (!state.disk) return;
    const g = state.disk.grub;

    if (args.length === 0) {
      const deviceTokens = ['(hd0)', ...g.devices.map((dev) => `(${dev.deviceId})`)];
      this.appendLine(deviceTokens.join(' '));
      this.appendBlankLine();
      return;
    }

    const rawArg = args[0].trim();

    // Consulta del disco completo sin partición: ls (hd0) o ls (hd0)/
    if (/^\(?hd0\)?\/?$/i.test(rawArg)) {
      const label = state.disk.isGpt ? 'gpt' : 'msdos';
      this.appendLine(
        `Device hd0: No known filesystem detected - Sector size 512B - Partition table: ${label}`
      );
      this.appendBlankLine();
      return;
    }

    const match = rawArg.match(/^\(?([a-z0-9]+,[a-z0-9]+)\)?(\/.*)?$/i);
    if (!match) {
      this.appendLine(`error: invalid file name \`${rawArg}'.`, 'terminal-line-error');
      this.appendBlankLine();
      return;
    }

    const devId = match[1].toLowerCase();
    const subPath = match[2];
    const devEntry = g.devices.find((d) => d.deviceId === devId);

    if (!devEntry) {
      this.appendLine('error: no such partition.', 'terminal-line-error');
      this.appendBlankLine();
      return;
    }

    // Sin barra "/" -> información de la partición
    if (!subPath) {
      if (devEntry.fsType === 'swap') {
        this.appendLine(
          `\tPartition ${devId}: No known filesystem detected - Partition start at ...`
        );
      } else {
        const fsName =
          devEntry.fsType === 'ext4'
            ? 'ext2'
            : devEntry.fsType === 'fat32'
              ? 'fat'
              : 'ntfs';
        this.appendLine(
          `\tPartition ${devId}: Filesystem type ${fsName} - Label \`${devEntry.label}'`
        );
      }
      this.appendBlankLine();
      return;
    }

    if (devEntry.fsType === 'swap') {
      this.appendLine('error: unknown filesystem.', 'terminal-line-error');
      this.appendBlankLine();
      return;
    }

    const cleanPath = ('/' + subPath.replace(/^\/+/, '').replace(/\/+$/, '')).toLowerCase();

    if (devEntry.fsType === 'ext4') {
      if (cleanPath === '/') {
        this.appendLine(
          'lost+found/ boot/ etc/ home/ usr/ var/ vmlinuz initrd.img'
        );
        this.appendBlankLine();
        return;
      }
      if (cleanPath === '/boot') {
        this.appendLine(
          `grub/ vmlinuz-${g.kernelVersion} initrd.img-${g.kernelVersion} System.map-${g.kernelVersion} config-${g.kernelVersion}`
        );
        this.appendBlankLine();
        return;
      }
      if (cleanPath === '/boot/grub') {
        this.appendLine(`grub.cfg grubenv fonts/ locale/ ${g.archDir}/`);
        this.appendBlankLine();
        return;
      }
      if (cleanPath === `/boot/grub/${g.archDir.toLowerCase()}`) {
        this.appendLine(
          'normal.mod ext2.mod part_gpt.mod part_msdos.mod linux.mod boot.mod terminal.mod ls.mod'
        );
        this.appendBlankLine();
        return;
      }
      if (cleanPath === '/etc' || cleanPath === '/home' || cleanPath === '/usr' || cleanPath === '/var') {
        this.appendLine('./ ../');
        this.appendBlankLine();
        return;
      }
      this.appendLine(`error: file \`${subPath}' not found.`, 'terminal-line-error');
      this.appendBlankLine();
      return;
    }

    if (devEntry.fsType === 'fat32') {
      if (cleanPath === '/') {
        this.appendLine('efi/');
        this.appendBlankLine();
        return;
      }
      if (cleanPath === '/efi') {
        this.appendLine('boot/ ubuntu/');
        this.appendBlankLine();
        return;
      }
      if (cleanPath === '/efi/ubuntu' || cleanPath === '/efi/boot') {
        this.appendLine('grubx64.efi shimx64.efi grub.cfg');
        this.appendBlankLine();
        return;
      }
      this.appendLine(`error: file \`${subPath}' not found.`, 'terminal-line-error');
      this.appendBlankLine();
      return;
    }

    if (devEntry.fsType === 'ntfs') {
      if (cleanPath === '/') {
        this.appendLine('PerfLogs/ Program Files/ Users/ Windows/ bootmgr');
        this.appendBlankLine();
        return;
      }
      this.appendLine(`error: file \`${subPath}' not found.`, 'terminal-line-error');
      this.appendBlankLine();
    }
  }

  /**
   * Comando set de GRUB Rescue: muestra variables o actualiza root / prefix.
   * @param {string} rawRest
   */
  cmdGrubSet(rawRest) {
    if (!state.disk) return;
    const g = state.disk.grub;

    if (!rawRest) {
      this.appendLine(`cmdpath=${g.cmdpath}`);
      this.appendLine(`prefix=${g.prefix}`);
      this.appendLine(`root=${g.root}`);
      Object.entries(g.extraVars).forEach(([k, v]) => {
        this.appendLine(`${k}=${v}`);
      });
      this.appendBlankLine();
      return;
    }

    const eqIdx = rawRest.indexOf('=');
    if (eqIdx === -1) {
      this.appendLine('Sintaxis: set <variable>=<valor> (ej. set root=(hd0,gpt3))', 'terminal-line-muted');
      this.appendBlankLine();
      return;
    }

    const key = rawRest.slice(0, eqIdx).trim().toLowerCase();
    const val = rawRest.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');

    if (key === 'root') {
      g.root = normalizeGrubDevice(val);
      // Si el usuario cambia root a una partición inválida después de cargar, exigir recarga
      if (!isGrubEnvConfiguredCorrectly(g)) {
        g.normalLoaded = false;
      }
    } else if (key === 'prefix') {
      g.prefix = val;
      if (!isGrubEnvConfiguredCorrectly(g)) {
        g.normalLoaded = false;
      }
    } else if (key === 'cmdpath') {
      g.cmdpath = val;
    } else {
      g.extraVars[key] = val;
    }

    syncVisualsFromDiskState();
    renderDiskVisualizer(getCurrentScenario());
    this.appendBlankLine();
  }

  /**
   * Comando insmod de GRUB Rescue (especialmente insmod normal).
   * @param {string[]} args
   */
  cmdGrubInsmod(args) {
    if (!state.disk) return;
    const g = state.disk.grub;
    const modName = (args[0] || '').trim().toLowerCase().replace(/\.mod$/, '');

    if (!modName) {
      this.appendLine('error: syntax error.', 'terminal-line-error');
      this.appendBlankLine();
      return;
    }

    if (!isGrubEnvConfiguredCorrectly(g)) {
      this.appendLine('error: file not found.', 'terminal-line-error');
      this.appendLine(
        `Verifica las variables con "set": root y prefix deben apuntar a (${g.validBootDevice})/boot/grub.`,
        'terminal-line-muted'
      );
      this.appendBlankLine();
      return;
    }

    if (modName === 'normal' || modName === 'linux' || modName === 'ext2') {
      if (modName === 'normal') {
        g.normalLoaded = true;
      }
      soundFX.playSuccess();
      syncVisualsFromDiskState();
      renderDiskVisualizer(getCurrentScenario());
      this.appendBlankLine();
      return;
    }

    this.appendLine('error: file not found.', 'terminal-line-error');
    this.appendBlankLine();
  }

  /**
   * Comando normal de GRUB: reinicia el terminal mostrando el menú de GRUB y mensaje de victoria.
   */
  cmdGrubNormal() {
    if (!state.disk) return;
    const g = state.disk.grub;

    if (!g.normalLoaded || !isGrubEnvConfiguredCorrectly(g)) {
      this.appendLine("Unknown command 'normal'.", 'terminal-line-error');
      this.appendLine(
        'Carga primero el módulo normal tras configurar root y prefix: "insmod normal".',
        'terminal-line-muted'
      );
      this.appendBlankLine();
      return;
    }

    g.booted = true;
    syncVisualsFromDiskState();
    renderDiskVisualizer(getCurrentScenario());

    this.clearScreen();
    this.appendLine('                         GNU GRUB  version 2.06', 'terminal-line-strong');
    this.appendLine(' +--------------------------------------------------------------------+');
    this.appendLine(` | *${g.distroName.padEnd(65, ' ')} |`, 'terminal-line-strong');
    this.appendLine(` |  Opciones avanzadas para ${g.distroName.slice(0, 41).padEnd(41, ' ')} |`);
    this.appendLine(' |  Windows Boot Manager (en /dev/sda1)                               |');
    this.appendLine(' |                                                                    |');
    this.appendLine(' +--------------------------------------------------------------------+');
    this.appendBlankLine();
    this.appendLine(
      `Booting \`${g.distroName}' (Linux ${g.kernelVersion})...`,
      'terminal-line-strong'
    );
    this.appendLine(`Loading Linux ${g.kernelVersion} ...`);
    this.appendLine('Loading initial ramdisk ...');
    this.appendBlankLine();
    this.appendLine(
      `[OK] Arranque completado con éxito: el sistema ${g.distroName} ha iniciado desde (${g.validBootDevice}).`,
      'terminal-line-strong'
    );
    this.appendLine(
      'Puedes seguir inspeccionando con "ls", "set", limpiar con "clear" o pulsar "Reiniciar consola" para repetir la práctica.',
      'terminal-line-muted'
    );
    this.appendBlankLine();
    evaluateScenarioVictory();
  }

  /**
   * Procesa comandos en el entorno Windows PE (cmd.exe).
   * @param {string} trimmed
   */
  executeWindowsCommand(trimmed) {
    const parts = trimmed.split(/\s+/);
    const rawCmd = parts[0];
    const cmd = rawCmd.toLowerCase();
    const args = parts.slice(1);

    if (cmd === 'cls' || cmd === 'clear') {
      this.clearScreen();
      return;
    }

    if (cmd === 'help' || cmd === '?') {
      this.printHelp();
      return;
    }

    if (cmd === 'history') {
      this.printHistory();
      return;
    }

    // Cambio directo de unidad (ej. C:, X:, S:)
    if (/^[a-z]:$/i.test(rawCmd)) {
      this.switchDrive(rawCmd[0].toUpperCase());
      return;
    }

    if (cmd === 'cd' || cmd === 'chdir' || cmd === 'cd..' || cmd === 'cd\\') {
      const normalizedArgs =
        cmd === 'cd..' ? ['..'] : cmd === 'cd\\' ? ['\\'] : args;
      this.cmdCd(normalizedArgs);
      return;
    }

    if (cmd === 'dir') {
      this.cmdDir(args);
      return;
    }

    if (cmd === 'bootrec' || cmd === 'bootrec.exe') {
      this.cmdBootrec(args);
      return;
    }

    if (cmd === 'bcdboot' || cmd === 'bcdboot.exe') {
      this.cmdBcdboot(args);
      return;
    }

    if (cmd === 'bcdedit' || cmd === 'bcdedit.exe') {
      this.cmdBcdedit(args);
      return;
    }

    if (cmd === 'diskpart' || cmd === 'diskpart.exe') {
      this.enterDiskpart();
      return;
    }

    if (cmd === 'chkdsk' || cmd === 'chkdsk.exe') {
      this.cmdChkdsk(args);
      return;
    }

    if (cmd === 'ver') {
      this.appendBlankLine();
      this.appendLine('Microsoft Windows [Versión 10.0.22621.1]');
      this.appendBlankLine();
      return;
    }

    if (cmd === 'type') {
      this.cmdType(args);
      return;
    }

    if (cmd === 'exit') {
      this.cmdExitWinPE();
      return;
    }

    this.printUnknownCommand(rawCmd);
  }

  /**
   * Simula chkdsk sobre una unidad montada en Windows PE.
   * @param {string[]} args
   */
  cmdChkdsk(args) {
    const targetArg = args.find((a) => /^[a-z]:$/i.test(a));
    const drive = (targetArg ? targetArg[0] : this.currentDrive).toUpperCase();

    if (!this.isDriveAvailable(drive)) {
      this.appendLine('No se puede abrir el volumen para acceso directo.', 'terminal-line-error');
      this.appendBlankLine();
      return;
    }

    const vol = state.disk?.volumes.find((v) => v.letter.toUpperCase() === drive);
    const fsLabel = vol ? vol.fs : 'NTFS';

    this.appendLine(`El tipo del sistema de archivos es ${fsLabel}.`);
    this.appendLine('Etapa 1: Examinando la estructura básica del sistema de archivos...');
    this.appendLine('  148224 registros de archivo procesados.');
    this.appendLine('Etapa 2: Examinando la vinculación de nombres de archivo...');
    this.appendLine('  194128 entradas de índice procesadas.');
    this.appendLine('Etapa 3: Examinando descriptores de seguridad...');
    this.appendLine('Windows examinó el sistema de archivos y no encontró problemas.');
    this.appendBlankLine();
  }

  /**
   * Simula el comando type en Windows PE para inspeccionar archivos clave.
   * @param {string[]} args
   */
  cmdType(args) {
    if (!args.length) {
      this.appendLine('La sintaxis del comando no es correcta.', 'terminal-line-error');
      this.appendBlankLine();
      return;
    }
    const target = args[0].toUpperCase();
    if (target.includes('BCD')) {
      if (state.disk?.boot.bcdHealthy) {
        this.appendLine('[Almacén BCD binario válido · Regf/Hive header OK · 2 entradas activas]');
      } else {
        this.appendLine(
          'Error al leer el archivo: estructura BCD dañada o truncada (0xc0000098).',
          'terminal-line-error'
        );
      }
      this.appendBlankLine();
      return;
    }
    this.appendLine('El sistema no puede encontrar el archivo especificado.', 'terminal-line-error');
    this.appendBlankLine();
  }

  /**
   * Verifica si una letra de unidad está montada en el entorno Windows PE.
   * @param {string} driveLetter
   */
  isDriveAvailable(driveLetter) {
    const upper = driveLetter.toUpperCase();
    if (upper === 'X') return true;
    if (!state.disk) return false;
    return state.disk.volumes.some((v) => v.letter.toUpperCase() === upper);
  }

  /**
   * Cambia la unidad activa (ej. X: -> C: o S:).
   * @param {string} driveLetter
   */
  switchDrive(driveLetter) {
    const upper = driveLetter.toUpperCase();
    if (!this.isDriveAvailable(upper)) {
      this.appendLine('El sistema no puede encontrar la unidad especificada.', 'terminal-line-error');
      this.appendBlankLine();
      return;
    }
    this.currentDrive = upper;
    if (!this.driveCwds[upper]) {
      this.driveCwds[upper] = `${upper}:\\`;
    }
    this.updatePrompt();
    this.appendBlankLine();
  }

  /**
   * Resuelve una ruta estilo Windows relativa o absoluta contra el estado actual.
   * @param {string} targetPath
   */
  resolveWindowsPath(targetPath) {
    let workDrive = this.currentDrive;
    let rest = targetPath.trim().replace(/\//g, '\\');

    const driveMatch = rest.match(/^([a-z]):(.*)$/i);
    if (driveMatch) {
      workDrive = driveMatch[1].toUpperCase();
      rest = driveMatch[2] || '\\';
    }

    if (!this.isDriveAvailable(workDrive)) {
      return { error: 'El sistema no puede encontrar la unidad especificada.' };
    }

    const baseCwd = this.driveCwds[workDrive] || `${workDrive}:\\`;
    const baseParts = baseCwd.slice(3).split('\\').filter(Boolean);
    const segments = rest.startsWith('\\') ? [] : [...baseParts];

    rest.split('\\').forEach((seg) => {
      if (!seg || seg === '.') return;
      if (seg === '..') {
        segments.pop();
      } else {
        segments.push(seg);
      }
    });

    const fullPath = `${workDrive}:\\${segments.join('\\')}`;
    return { drive: workDrive, path: fullPath };
  }

  /**
   * Devuelve el listado virtual de entradas de un directorio en Windows PE.
   * @param {string} fullPath
   */
  getVirtualDirectoryEntries(fullPath) {
    const normalized = fullPath.toUpperCase();
    const drive = normalized[0];
    const subPath = normalized.slice(2).replace(/\\+$/, '') || '\\';
    const d = state.disk;

    if (drive === 'X') {
      if (subPath === '\\') {
        return {
          label: 'Boot (RAMDisk)',
          serial: '4A9C-11E2',
          freeBytes: '482.344.960',
          entries: [
            { date: '06/05/2023  09:14', isDir: true, size: '', name: 'Program Files' },
            { date: '06/05/2023  09:14', isDir: true, size: '', name: 'Sources' },
            { date: '06/05/2023  09:14', isDir: true, size: '', name: 'Users' },
            { date: '06/05/2023  09:15', isDir: true, size: '', name: 'Windows' },
          ],
        };
      }
      if (subPath === '\\SOURCES') {
        return {
          label: 'Boot (RAMDisk)',
          serial: '4A9C-11E2',
          freeBytes: '482.344.960',
          entries: [
            { date: '06/05/2023  09:14', isDir: true, size: '', name: '.' },
            { date: '06/05/2023  09:14', isDir: true, size: '', name: '..' },
            { date: '06/05/2023  09:14', isDir: true, size: '', name: 'es-ES' },
            { date: '06/05/2023  09:12', isDir: false, size: '374.128.640', name: 'boot.wim' },
            { date: '06/05/2023  09:14', isDir: false, size: '245.760', name: 'setup.exe' },
            { date: '06/05/2023  09:14', isDir: false, size: '188.416', name: 'spwizimg.dll' },
          ],
        };
      }
      if (subPath === '\\WINDOWS' || subPath === '\\WINDOWS\\SYSTEM32') {
        return {
          label: 'Boot (RAMDisk)',
          serial: '4A9C-11E2',
          freeBytes: '482.344.960',
          entries: [
            { date: '06/05/2023  09:14', isDir: true, size: '', name: '.' },
            { date: '06/05/2023  09:14', isDir: true, size: '', name: '..' },
            ...(subPath === '\\WINDOWS'
              ? [{ date: '06/05/2023  09:15', isDir: true, size: '', name: 'System32' }]
              : [
                  { date: '06/05/2023  09:15', isDir: false, size: '412.672', name: 'bcdedit.exe' },
                  { date: '06/05/2023  09:15', isDir: false, size: '311.296', name: 'bootrec.exe' },
                  { date: '06/05/2023  09:15', isDir: false, size: '321.536', name: 'cmd.exe' },
                  { date: '06/05/2023  09:15', isDir: false, size: '164.864', name: 'diskpart.exe' },
                ]),
          ],
        };
      }
      if (subPath === '\\USERS' || subPath === '\\PROGRAM FILES' || subPath === '\\SOURCES\\ES-ES') {
        return {
          label: 'Boot (RAMDisk)',
          serial: '4A9C-11E2',
          freeBytes: '482.344.960',
          entries: [
            { date: '06/05/2023  09:14', isDir: true, size: '', name: '.' },
            { date: '06/05/2023  09:14', isDir: true, size: '', name: '..' },
          ],
        };
      }
      return null;
    }

    const vol = d?.volumes.find((v) => v.letter.toUpperCase() === drive);
    if (!vol) return null;

    if (vol.role === 'os') {
      if (subPath === '\\') {
        return {
          label: vol.label || 'Windows',
          serial: '9E4B-72C1',
          freeBytes: '318.492.114.944',
          entries: [
            { date: '14/10/2026  18:22', isDir: true, size: '', name: 'PerfLogs' },
            { date: '14/10/2026  18:30', isDir: true, size: '', name: 'Program Files' },
            { date: '14/10/2026  18:30', isDir: true, size: '', name: 'Program Files (x86)' },
            { date: '15/10/2026  11:04', isDir: true, size: '', name: 'Users' },
            { date: '16/11/2026  01:40', isDir: true, size: '', name: 'Windows' },
            ...(d?.isGpt
              ? []
              : [{ date: '14/10/2026  18:20', isDir: false, size: '427.680', name: 'bootmgr' }]),
          ],
        };
      }
      if (subPath === '\\WINDOWS') {
        return {
          label: vol.label || 'Windows',
          serial: '9E4B-72C1',
          freeBytes: '318.492.114.944',
          entries: [
            { date: '16/11/2026  01:40', isDir: true, size: '', name: '.' },
            { date: '16/11/2026  01:40', isDir: true, size: '', name: '..' },
            { date: '16/11/2026  01:38', isDir: true, size: '', name: 'Boot' },
            { date: '16/11/2026  01:40', isDir: true, size: '', name: 'System32' },
            { date: '14/10/2026  18:22', isDir: false, size: '5.144.576', name: 'explorer.exe' },
            { date: '14/10/2026  18:22', isDir: false, size: '256.000', name: 'notepad.exe' },
          ],
        };
      }
      if (subPath === '\\WINDOWS\\SYSTEM32') {
        return {
          label: vol.label || 'Windows',
          serial: '9E4B-72C1',
          freeBytes: '318.492.114.944',
          entries: [
            { date: '16/11/2026  01:40', isDir: true, size: '', name: '.' },
            { date: '16/11/2026  01:40', isDir: true, size: '', name: '..' },
            { date: '14/10/2026  18:25', isDir: false, size: '11.452.416', name: 'ntoskrnl.exe' },
            {
              date: '14/10/2026  18:25',
              isDir: false,
              size: '1.894.120',
              name: d?.isGpt ? 'winload.efi' : 'winload.exe',
            },
            { date: '14/10/2026  18:25', isDir: false, size: '1.632.000', name: 'winresume.efi' },
          ],
        };
      }
      if (
        subPath === '\\WINDOWS\\BOOT' ||
        subPath === '\\USERS' ||
        subPath === '\\PROGRAM FILES' ||
        subPath === '\\PROGRAM FILES (X86)' ||
        subPath === '\\PERFLOGS'
      ) {
        return {
          label: vol.label || 'Windows',
          serial: '9E4B-72C1',
          freeBytes: '318.492.114.944',
          entries: [
            { date: '16/11/2026  01:40', isDir: true, size: '', name: '.' },
            { date: '16/11/2026  01:40', isDir: true, size: '', name: '..' },
          ],
        };
      }
      return null;
    }

    if (vol.role === 'efi') {
      if (subPath === '\\') {
        return {
          label: 'ESP',
          serial: 'C204-88A1',
          freeBytes: '234.881.024',
          entries: [{ date: '14/10/2026  18:19', isDir: true, size: '', name: 'EFI' }],
        };
      }
      if (subPath === '\\EFI') {
        return {
          label: 'ESP',
          serial: 'C204-88A1',
          freeBytes: '234.881.024',
          entries: [
            { date: '14/10/2026  18:19', isDir: true, size: '', name: '.' },
            { date: '14/10/2026  18:19', isDir: true, size: '', name: '..' },
            { date: '14/10/2026  18:19', isDir: true, size: '', name: 'Boot' },
            { date: '14/10/2026  18:19', isDir: true, size: '', name: 'Microsoft' },
          ],
        };
      }
      if (subPath === '\\EFI\\BOOT') {
        return {
          label: 'ESP',
          serial: 'C204-88A1',
          freeBytes: '234.881.024',
          entries: [
            { date: '14/10/2026  18:19', isDir: true, size: '', name: '.' },
            { date: '14/10/2026  18:19', isDir: true, size: '', name: '..' },
            { date: '14/10/2026  18:19', isDir: false, size: '1.586.448', name: 'bootx64.efi' },
          ],
        };
      }
      if (subPath === '\\EFI\\MICROSOFT') {
        return {
          label: 'ESP',
          serial: 'C204-88A1',
          freeBytes: '234.881.024',
          entries: [
            { date: '14/10/2026  18:19', isDir: true, size: '', name: '.' },
            { date: '14/10/2026  18:19', isDir: true, size: '', name: '..' },
            { date: '14/10/2026  18:19', isDir: true, size: '', name: 'Boot' },
          ],
        };
      }
      if (subPath === '\\EFI\\MICROSOFT\\BOOT') {
        return {
          label: 'ESP',
          serial: 'C204-88A1',
          freeBytes: '234.881.024',
          entries: [
            { date: '14/10/2026  18:19', isDir: true, size: '', name: '.' },
            { date: '14/10/2026  18:19', isDir: true, size: '', name: '..' },
            {
              date: d?.boot.bcdHealthy ? '16/11/2026  02:35' : '14/10/2026  18:19',
              isDir: false,
              size: d?.boot.bcdHealthy ? '32.768' : '28.672',
              name: d?.boot.bcdHealthy ? 'BCD' : 'BCD (corrupto)',
            },
            { date: '14/10/2026  18:19', isDir: false, size: '1.586.448', name: 'bootmgfw.efi' },
            { date: '14/10/2026  18:19', isDir: false, size: '1.564.960', name: 'bootmgr.efi' },
          ],
        };
      }
      return null;
    }

    if (vol.role === 'system-reserved') {
      if (subPath === '\\') {
        return {
          label: vol.label,
          serial: '7B12-40D8',
          freeBytes: '524.288.000',
          entries: [
            { date: '14/10/2026  18:18', isDir: true, size: '', name: 'Boot' },
            { date: '14/10/2026  18:18', isDir: false, size: '427.680', name: 'bootmgr' },
          ],
        };
      }
      if (subPath === '\\BOOT') {
        return {
          label: vol.label,
          serial: '7B12-40D8',
          freeBytes: '524.288.000',
          entries: [
            { date: '14/10/2026  18:18', isDir: true, size: '', name: '.' },
            { date: '14/10/2026  18:18', isDir: true, size: '', name: '..' },
            { date: '14/10/2026  18:18', isDir: false, size: '32.768', name: 'BCD' },
          ],
        };
      }
      return null;
    }

    if (subPath === '\\') {
      return {
        label: vol.label,
        serial: '3F01-992A',
        freeBytes: '184.549.376',
        entries: [{ date: '14/10/2026  18:20', isDir: true, size: '', name: 'Recovery' }],
      };
    }
    if (subPath === '\\RECOVERY') {
      return {
        label: vol.label,
        serial: '3F01-992A',
        freeBytes: '184.549.376',
        entries: [
          { date: '14/10/2026  18:20', isDir: true, size: '', name: '.' },
          { date: '14/10/2026  18:20', isDir: true, size: '', name: '..' },
          { date: '14/10/2026  18:20', isDir: false, size: '398.458.880', name: 'Winre.wim' },
        ],
      };
    }

    return null;
  }

  /**
   * Comando cd / chdir en Windows PE.
   * @param {string[]} args
   */
  cmdCd(args) {
    const filtered = args.filter((a) => a.toLowerCase() !== '/d');
    const forceSwitchDrive = args.some((a) => a.toLowerCase() === '/d');

    if (filtered.length === 0) {
      const cwd = this.driveCwds[this.currentDrive] || `${this.currentDrive}:\\`;
      this.appendLine(cwd);
      this.appendBlankLine();
      return;
    }

    const rawTarget = filtered.join(' ');
    const resolved = this.resolveWindowsPath(rawTarget);
    if ('error' in resolved) {
      this.appendLine(resolved.error, 'terminal-line-error');
      this.appendBlankLine();
      return;
    }

    const dirData = this.getVirtualDirectoryEntries(resolved.path);
    if (!dirData) {
      this.appendLine('El sistema no puede encontrar la ruta especificada.', 'terminal-line-error');
      this.appendBlankLine();
      return;
    }

    this.driveCwds[resolved.drive] = resolved.path;
    if (forceSwitchDrive || rawTarget.includes(':')) {
      this.currentDrive = resolved.drive;
    }
    this.updatePrompt();
    this.appendBlankLine();
  }

  /**
   * Comando dir en Windows PE.
   * @param {string[]} args
   */
  cmdDir(args) {
    const pathArgs = args.filter((a) => !a.startsWith('/'));
    const target =
      pathArgs.length > 0
        ? pathArgs.join(' ')
        : this.driveCwds[this.currentDrive] || `${this.currentDrive}:\\`;

    const resolved = this.resolveWindowsPath(target);
    if ('error' in resolved) {
      this.appendLine(resolved.error, 'terminal-line-error');
      this.appendBlankLine();
      return;
    }

    const dirData = this.getVirtualDirectoryEntries(resolved.path);
    if (!dirData) {
      this.appendLine('No se encuentra el archivo', 'terminal-line-error');
      this.appendBlankLine();
      return;
    }

    this.appendLine(
      dirData.label
        ? ` El volumen de la unidad ${resolved.drive} es ${dirData.label}`
        : ` El volumen de la unidad ${resolved.drive} no tiene etiqueta.`
    );
    this.appendLine(` El número de serie del volumen es: ${dirData.serial}`);
    this.appendBlankLine();
    this.appendLine(` Directorio de ${resolved.path}`);
    this.appendBlankLine();

    let fileCount = 0;
    let dirCount = 0;
    let totalBytes = 0;

    dirData.entries.forEach((entry) => {
      if (entry.isDir) {
        dirCount += 1;
        this.appendLine(`${entry.date}    <DIR>          ${entry.name}`);
      } else {
        fileCount += 1;
        totalBytes += Number(entry.size.replace(/\./g, '')) || 0;
        const paddedSize = entry.size.padStart(14, ' ');
        this.appendLine(`${entry.date}    ${paddedSize} ${entry.name}`);
      }
    });

    const formattedTotal = totalBytes.toLocaleString('es-ES');
    this.appendLine(`              ${String(fileCount).padStart(2, ' ')} archivos     ${formattedTotal} bytes`);
    this.appendLine(`              ${String(dirCount).padStart(2, ' ')} dirs  ${dirData.freeBytes} bytes libres`);
    this.appendBlankLine();
  }

  /**
   * Simula bootrec.exe (/fixmbr, /fixboot, /scanos, /rebuildbcd).
   * @param {string[]} args
   */
  cmdBootrec(args) {
    if (!state.disk) return;
    if (args.length === 0 || args[0] === '/?' || args[0].toLowerCase() === 'help') {
      this.appendLine('Herramienta de recuperación de arranque de Windows (bootrec.exe)');
      this.appendBlankLine();
      this.appendLine('Uso: bootrec [opción]');
      this.appendLine('  /fixmbr      Escribe un nuevo registro de arranque maestro en la partición del sistema.');
      this.appendLine('  /fixboot     Escribe un nuevo sector de arranque en la partición del sistema.');
      this.appendLine('  /scanos      Busca instalaciones de Windows compatibles en todos los discos.');
      this.appendLine('  /rebuildbcd  Examina los discos y reconstruye el almacén BCD.');
      this.appendBlankLine();
      return;
    }

    const flag = args[0].toLowerCase();

    if (flag === '/fixmbr') {
      state.disk.boot.mbrHealthy = true;
      soundFX.playSuccess();
      syncVisualsFromDiskState();
      renderDiskVisualizer(getCurrentScenario());
      this.appendLine('La operación se completó correctamente.');
      this.appendBlankLine();
      evaluateScenarioVictory();
      return;
    }

    if (flag === '/fixboot') {
      state.disk.boot.bootSectorHealthy = true;
      state.disk.boot.efiHealthy = true;
      soundFX.playSuccess();
      syncVisualsFromDiskState();
      renderDiskVisualizer(getCurrentScenario());
      this.appendLine('La operación se completó correctamente.');
      this.appendBlankLine();
      evaluateScenarioVictory();
      return;
    }

    if (flag === '/scanos') {
      this.appendLine('Buscando instalaciones de Windows en todos los discos.');
      this.appendLine('Espere, puede tardar unos minutos...');
      this.appendBlankLine();
      this.appendLine('Instalaciones de Windows examinadas correctamente.');
      this.appendLine('Total de instalaciones de Windows identificadas: 1');
      this.appendLine(`[1]  ${state.disk.boot.osDetectedPath}`);
      this.appendLine('La operación se completó correctamente.');
      this.appendBlankLine();
      return;
    }

    if (flag === '/rebuildbcd') {
      this.appendLine('Buscando instalaciones de Windows en todos los discos.');
      this.appendLine('Espere, puede tardar unos minutos...');
      this.appendBlankLine();
      this.appendLine('Instalaciones de Windows examinadas correctamente.');

      if (state.disk.boot.bcdHealthy && state.disk.boot.bcdEntriesRebuilt) {
        this.appendLine('Total de instalaciones de Windows identificadas: 0');
        this.appendLine('La operación se completó correctamente.');
        this.appendBlankLine();
        return;
      }

      this.appendLine('Total de instalaciones de Windows identificadas: 1');
      this.appendLine(`[1]  ${state.disk.boot.osDetectedPath}`);
      this.appendLine('¿Desea agregar la instalación a la lista de arranque? Sí<S>/No<N>/Todo<T>:');
      this.subMode = 'confirm-rebuildbcd';
      this.updatePrompt();
      return;
    }

    state.errorCount += 1;
    this.appendLine(`Opción no válida: "${args[0]}". Escribe "bootrec /?" para ver la sintaxis.`, 'terminal-line-error');
    this.appendBlankLine();
  }

  /**
   * Simula bcdboot.exe (ej. bcdboot C:\Windows o bcdboot C:\Windows /s S: /f UEFI).
   * @param {string[]} args
   */
  cmdBcdboot(args) {
    if (!state.disk) return;
    if (args.length === 0 || args[0] === '/?' || args[0].toLowerCase() === 'help') {
      this.appendLine('Bcdboot.exe: herramienta para crear y reparar archivos de arranque.');
      this.appendBlankLine();
      this.appendLine('Uso: bcdboot <origen> [/s <letra_unidad:>] [/f <UEFI|BIOS|ALL>]');
      this.appendLine('Ejemplo: bcdboot C:\\Windows /s S: /f UEFI');
      this.appendBlankLine();
      return;
    }

    const sourceArg = args[0].replace(/\\+$/, '').toUpperCase();
    if (sourceArg !== 'C:\\WINDOWS' && sourceArg !== 'C:') {
      state.errorCount += 1;
      this.appendLine(`BFSVC Error: No se encontró el directorio de Windows en "${args[0]}".`, 'terminal-line-error');
      this.appendLine('Indica la ruta de instalación válida: C:\\Windows.', 'terminal-line-muted');
      this.appendBlankLine();
      return;
    }

    // Revisar si se especificó /s <letra:>
    let targetDrive = '';
    for (let i = 1; i < args.length; i += 1) {
      if (args[i].toLowerCase() === '/s' && args[i + 1]) {
        targetDrive = args[i + 1].replace(':', '').toUpperCase();
        break;
      }
      if (args[i].toLowerCase().startsWith('/s:')) {
        targetDrive = args[i].slice(3).replace(':', '').toUpperCase();
        break;
      }
    }

    if (targetDrive) {
      if (!this.isDriveAvailable(targetDrive)) {
        state.errorCount += 1;
        this.appendLine(
          `Error al intentar copiar archivos de arranque: la unidad ${targetDrive}: no está asignada.`,
          'terminal-line-error'
        );
        this.appendLine(
          'Asigna primero la letra en "diskpart" (select vol -> assign letter) o ejecuta "bcdboot C:\\Windows".',
          'terminal-line-muted'
        );
        this.appendBlankLine();
        return;
      }
    }

    state.disk.boot.bcdHealthy = true;
    state.disk.boot.bcdEntriesRebuilt = true;
    state.disk.boot.efiHealthy = true;
    state.disk.boot.bootSectorHealthy = true;

    soundFX.playSuccess();
    syncVisualsFromDiskState();
    renderDiskVisualizer(getCurrentScenario());
    this.appendLine('Los archivos de arranque se crearon correctamente.');
    this.appendBlankLine();
    evaluateScenarioVictory();
  }

  /**
   * Gestiona la confirmación interactiva de bootrec /rebuildbcd.
   * @param {string} answer
   */
  handleRebuildBcdConfirmation(answer) {
    const normalized = answer.toLowerCase();
    const accept = ['s', 'sí', 'si', 'y', 'yes', 't', 'todo', 'a', 'all'].includes(normalized);
    const reject = ['n', 'no'].includes(normalized);

    if (!accept && !reject) {
      this.appendLine('Respuesta no válida. Introduce S (Sí), N (No) o T (Todo).', 'terminal-line-muted');
      return;
    }

    if (accept && state.disk) {
      state.disk.boot.bcdHealthy = true;
      state.disk.boot.bcdEntriesRebuilt = true;
      state.disk.boot.efiHealthy = true;
      state.disk.boot.bootSectorHealthy = true;
      soundFX.playSuccess();
      syncVisualsFromDiskState();
      renderDiskVisualizer(getCurrentScenario());
    }

    this.subMode = null;
    this.updatePrompt();
    this.appendLine('La operación se completó correctamente.');
    this.appendBlankLine();
    if (accept) {
      evaluateScenarioVictory();
    }
  }

  /**
   * Simula bcdedit.exe consultando el estado global del almacén BCD.
   * @param {string[]} args
   */
  cmdBcdedit(args) {
    if (!state.disk) return;
    const firstArg = (args[0] || '').toLowerCase();

    if (firstArg === '/?') {
      this.appendLine('Editor de datos de configuración de arranque (bcdedit.exe)');
      this.appendBlankLine();
      this.appendLine('Comandos simulados disponibles:');
      this.appendLine('  bcdedit                 Muestra las entradas del almacén BCD activo.');
      this.appendLine('  bcdedit /enum [all]     Lista los identificadores de arranque.');
      this.appendLine('  bcdedit /store <ruta>   Consulta un almacén BCD en un volumen montado.');
      this.appendBlankLine();
      return;
    }

    if (firstArg === '/store') {
      const storePath = args[1];
      if (!storePath) {
        this.appendLine('El parámetro "/store" requiere una ruta de archivo válida.', 'terminal-line-error');
        this.appendBlankLine();
        return;
      }
      const driveMatch = storePath.match(/^([a-z]):/i);
      if (driveMatch && !this.isDriveAvailable(driveMatch[1])) {
        this.appendLine('No se puede abrir el almacén de datos de configuración de arranque.', 'terminal-line-error');
        this.appendLine('El sistema no puede encontrar la unidad especificada.', 'terminal-line-error');
        this.appendBlankLine();
        return;
      }
    }

    if (!state.disk.boot.bcdHealthy) {
      this.appendLine('No se puede abrir el almacén de datos de configuración de arranque.', 'terminal-line-error');
      this.appendLine(
        state.disk.isGpt
          ? 'El archivo o directorio está dañado o es ilegible (código 0xc000000f).'
          : 'El sistema no puede encontrar el archivo especificado.',
        'terminal-line-error'
      );
      this.appendLine(
        'Sugerencia: Reconstruye el almacén con "bootrec /rebuildbcd" o monta la partición EFI en "diskpart".',
        'terminal-line-muted'
      );
      this.appendBlankLine();
      return;
    }

    const isUefi = state.disk.isGpt;
    const loaderPath = isUefi
      ? '\\Windows\\system32\\winload.efi'
      : '\\Windows\\system32\\winload.exe';
    const efiVol = state.disk.volumes.find((v) => v.role === 'efi');
    const bootMgrDevice = isUefi
      ? efiVol?.letter
        ? `partition=${efiVol.letter.toUpperCase()}:`
        : 'partition=\\Device\\HarddiskVolume1'
      : 'partition=\\Device\\HarddiskVolume1';

    this.appendBlankLine();
    this.appendLine('Administrador de arranque de Windows', 'terminal-line-strong');
    this.appendLine('-------------------------------------');
    this.appendLine('identificador           {bootmgr}');
    this.appendLine(`device                  ${bootMgrDevice}`);
    if (isUefi) {
      this.appendLine('path                    \\EFI\\Microsoft\\Boot\\bootmgfw.efi');
    }
    this.appendLine('description             Windows Boot Manager');
    this.appendLine('locale                  es-ES');
    this.appendLine('default                 {default}');
    this.appendLine('displayorder            {default}');
    this.appendLine('timeout                 30');
    this.appendBlankLine();
    this.appendLine('Cargador de arranque de Windows', 'terminal-line-strong');
    this.appendLine('--------------------------------');
    this.appendLine('identificador           {default}');
    this.appendLine('device                  partition=C:');
    this.appendLine(`path                    ${loaderPath}`);
    this.appendLine('description             Windows 10 / 11');
    this.appendLine('locale                  es-ES');
    this.appendLine('osdevice                partition=C:');
    this.appendLine('systemroot              \\Windows');
    this.appendBlankLine();
  }

  /**
   * Entra al sub-nivel interactivo de DiskPart.
   */
  enterDiskpart() {
    this.subMode = 'diskpart';
    this.updatePrompt();
    this.appendBlankLine();
    this.appendLine('Microsoft DiskPart versión 10.0.22621.1', 'terminal-line-strong');
    this.appendBlankLine();
    this.appendLine('Copyright (C) Microsoft Corporation.');
    this.appendLine('En el equipo: MININT-GHOSTLAB');
    this.appendBlankLine();
  }

  /**
   * Procesa los comandos del sub-nivel DISKPART>.
   * @param {string} trimmed
   */
  executeDiskpartCommand(trimmed) {
    if (!state.disk) return;
    const d = state.disk;
    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg1 = (parts[1] || '').toLowerCase();
    const arg2 = parts[2] || '';

    if (cmd === 'cls' || cmd === 'clear') {
      this.clearScreen();
      return;
    }

    if (cmd === 'exit' || cmd === 'quit') {
      this.subMode = null;
      this.updatePrompt();
      this.appendBlankLine();
      this.appendLine('Saliendo de DiskPart...');
      this.appendBlankLine();
      return;
    }

    if (cmd === 'help' || cmd === '?') {
      this.appendBlankLine();
      this.appendLine('Comandos disponibles en el simulador DiskPart:', 'terminal-line-strong');
      this.appendLine('  LIST DISK               Muestra la lista de discos físicos.');
      this.appendLine('  LIST VOL                Muestra los volúmenes detectados.');
      this.appendLine('  LIST PART               Muestra las particiones del disco seleccionado.');
      this.appendLine('  SELECT DISK <n>         Selecciona el disco especificado (ej. 0).');
      this.appendLine('  SELECT VOL <n>          Selecciona el volumen especificado.');
      this.appendLine('  DETAIL DISK | VOL       Muestra los atributos del disco o volumen activo.');
      this.appendLine('  ASSIGN LETTER=<X>       Asigna una letra de unidad al volumen seleccionado.');
      this.appendLine('  REMOVE LETTER=<X>       Quita la letra asignada al volumen seleccionado.');
      this.appendLine('  FORMAT FS=FAT32 QUICK   Formatea el volumen EFI seleccionado como FAT32.');
      this.appendLine('  ACTIVE                  Marca el volumen seleccionado como activo (MBR).');
      this.appendLine('  EXIT                    Sale de DiskPart hacia Windows PE.');
      this.appendBlankLine();
      return;
    }

    if (cmd === 'list' || cmd === 'lis') {
      if (arg1 === 'disk' || arg1 === 'dis') {
        const gptMark = d.isGpt ? '*' : ' ';
        const selMark = d.selectedDisk === 0 ? '*' : ' ';
        this.appendBlankLine();
        this.appendLine('  Núm Disco  Estado      Tamaño   Disp     Din  Gpt');
        this.appendLine('  ---------- ----------  -------  -------  ---  ---');
        this.appendLine(
          `${selMark} Disco ${d.diskNumber}    ${d.status.padEnd(10, ' ')}  ${d.size.padEnd(7, ' ')}  ${d.free.padEnd(7, ' ')}       ${gptMark}`
        );
        this.appendBlankLine();
        return;
      }

      if (arg1 === 'vol' || arg1 === 'volume') {
        this.appendBlankLine();
        this.appendLine('  Núm. Volumen  Ltr  Etiqueta           Fs     Tipo        Tamaño   Estado      Info');
        this.appendLine('  ------------  ---  -----------------  -----  ----------  -------  ----------  --------');
        d.volumes.forEach((v) => {
          const sel = d.selectedVolume === v.volIndex ? '*' : ' ';
          const volCol = `Volumen ${v.volIndex}`.padEnd(12, ' ');
          const ltrCol = (v.letter ? v.letter.toUpperCase() : '').padEnd(3, ' ');
          const lblCol = v.label.slice(0, 17).padEnd(17, ' ');
          const fsCol = v.fs.slice(0, 5).padEnd(5, ' ');
          const typeCol = v.type.padEnd(10, ' ');
          const sizeCol = v.size.padEnd(7, ' ');
          const statusCol = 'Correcto'.padEnd(10, ' ');
          this.appendLine(
            `${sel} ${volCol}  ${ltrCol}  ${lblCol}  ${fsCol}  ${typeCol}  ${sizeCol}  ${statusCol}  ${v.info}`
          );
        });
        this.appendBlankLine();
        return;
      }

      if (arg1 === 'part' || arg1 === 'partition') {
        if (d.selectedDisk === null) {
          this.appendLine('No hay ningún disco seleccionado.', 'terminal-line-error');
          this.appendLine('Seleccione un disco con "SELECT DISK 0" e inténtelo de nuevo.', 'terminal-line-muted');
          this.appendBlankLine();
          return;
        }
        this.appendBlankLine();
        this.appendLine('  Partición ###  Tipo              Tamaño   Desplazamiento');
        this.appendLine('  -------------  ----------------  -------  --------------');
        d.partitions.forEach((p, idx) => {
          const numCol = `Partición ${idx + 1}`.padEnd(13, ' ');
          const tipo = p.id.includes('esp')
            ? 'Sistema'
            : p.id.includes('msr')
              ? 'Reservado'
              : p.id.includes('rec')
                ? 'Recuperación'
                : 'Principal';
          this.appendLine(`  ${numCol}  ${tipo.padEnd(16, ' ')}  ${p.size.padEnd(7, ' ')}  1024 KB`);
        });
        this.appendBlankLine();
        return;
      }
    }

    if (cmd === 'select' || cmd === 'sel') {
      const num = Number.parseInt(arg2, 10);
      if (arg1 === 'disk' || arg1 === 'dis') {
        if (Number.isNaN(num) || num !== 0) {
          this.appendLine('El disco especificado no es válido.', 'terminal-line-error');
          this.appendBlankLine();
          return;
        }
        d.selectedDisk = 0;
        this.appendBlankLine();
        this.appendLine('El disco 0 es ahora el disco seleccionado.');
        this.appendBlankLine();
        return;
      }

      if (arg1 === 'vol' || arg1 === 'volume') {
        const vol = d.volumes.find((v) => v.volIndex === num);
        if (Number.isNaN(num) || !vol) {
          this.appendLine('El volumen especificado no es válido.', 'terminal-line-error');
          this.appendBlankLine();
          return;
        }
        d.selectedVolume = vol.volIndex;
        state.selectedPartitionId = vol.partitionId;
        renderDiskVisualizer(getCurrentScenario());
        this.appendBlankLine();
        this.appendLine(`El volumen ${vol.volIndex} es el volumen seleccionado.`);
        this.appendBlankLine();
        return;
      }
    }

    if (cmd === 'assign') {
      if (d.selectedVolume === null) {
        this.appendLine('No hay ningún volumen seleccionado.', 'terminal-line-error');
        this.appendLine('Seleccione un volumen e inténtelo de nuevo (ej. "select vol 0").', 'terminal-line-muted');
        this.appendBlankLine();
        return;
      }
      const vol = d.volumes.find((v) => v.volIndex === d.selectedVolume);
      if (!vol) return;

      const joinedArgs = parts.slice(1).join(' ');
      const letterMatch = joinedArgs.match(/letter\s*=?\s*([a-z]):?/i);
      if (!letterMatch) {
        this.appendLine('Sintaxis: ASSIGN LETTER=<letra> (ejemplo: assign letter=S).', 'terminal-line-error');
        this.appendBlankLine();
        return;
      }

      const targetLetter = letterMatch[1].toUpperCase();
      if (targetLetter === 'X' || d.volumes.some((v) => v.volIndex !== vol.volIndex && v.letter.toUpperCase() === targetLetter)) {
        this.appendLine(
          `La letra de unidad "${targetLetter}:" ya está en uso por otro volumen.`,
          'terminal-line-error'
        );
        this.appendBlankLine();
        return;
      }

      vol.letter = targetLetter;
      this.driveCwds[targetLetter] = `${targetLetter}:\\`;
      soundFX.playSuccess();
      renderDiskVisualizer(getCurrentScenario());
      this.appendBlankLine();
      this.appendLine('DiskPart asignó correctamente la letra de unidad o punto de montaje.');
      this.appendBlankLine();
      return;
    }

    if (cmd === 'remove') {
      if (d.selectedVolume === null) {
        this.appendLine('No hay ningún volumen seleccionado.', 'terminal-line-error');
        this.appendBlankLine();
        return;
      }
      const vol = d.volumes.find((v) => v.volIndex === d.selectedVolume);
      if (!vol) return;
      if (vol.role === 'os') {
        this.appendLine('No se puede quitar la letra de la unidad del volumen del sistema operativo.', 'terminal-line-error');
        this.appendBlankLine();
        return;
      }
      const oldLetter = vol.letter;
      vol.letter = '';
      if (oldLetter && this.currentDrive === oldLetter.toUpperCase()) {
        this.currentDrive = 'X';
        this.updatePrompt();
      }
      renderDiskVisualizer(getCurrentScenario());
      this.appendBlankLine();
      this.appendLine('DiskPart quitó correctamente la letra de unidad o punto de montaje.');
      this.appendBlankLine();
      return;
    }

    if (cmd === 'detail' || cmd === 'det') {
      if (arg1 === 'disk' || arg1 === 'dis') {
        if (d.selectedDisk === null) {
          this.appendLine('No hay ningún disco seleccionado.', 'terminal-line-error');
          this.appendBlankLine();
          return;
        }
        this.appendBlankLine();
        this.appendLine(d.model);
        this.appendLine(`Id. de disco: ${d.isGpt ? '{7E2A91B0-4F18-4D92-A1C3-8801A2E4B110}' : '0x4E89A1C2'}`);
        this.appendLine(`Tipo        : ${d.isGpt ? 'NVMe' : 'SATA'}`);
        this.appendLine(`Estado      : ${d.status}`);
        this.appendLine(`Esquema     : ${d.isGpt ? 'GPT' : 'MBR'}`);
        this.appendBlankLine();
        return;
      }
      if (arg1 === 'vol' || arg1 === 'volume') {
        if (d.selectedVolume === null) {
          this.appendLine('No hay ningún volumen seleccionado.', 'terminal-line-error');
          this.appendBlankLine();
          return;
        }
        const vol = d.volumes.find((v) => v.volIndex === d.selectedVolume);
        if (!vol) return;
        this.appendBlankLine();
        this.appendLine(`  Núm. Volumen ${vol.volIndex} (${vol.label})`);
        this.appendLine(`  Letra        : ${vol.letter || '(sin asignar)'}`);
        this.appendLine(`  Sistema FS   : ${vol.fs}`);
        this.appendLine(`  Tamaño       : ${vol.size}`);
        this.appendLine(`  Información  : ${vol.info}`);
        this.appendBlankLine();
        return;
      }
    }

    if (cmd === 'format') {
      if (d.selectedVolume === null) {
        this.appendLine('No hay ningún volumen seleccionado.', 'terminal-line-error');
        this.appendBlankLine();
        return;
      }
      const vol = d.volumes.find((v) => v.volIndex === d.selectedVolume);
      if (!vol) return;
      if (vol.role === 'os') {
        this.appendLine('Protección activa: no se permite formatear la partición del sistema Windows (C:).', 'terminal-line-error');
        this.appendBlankLine();
        return;
      }
      if (vol.role === 'efi') {
        d.boot.bcdHealthy = false;
        d.boot.efiHealthy = false;
        syncVisualsFromDiskState();
        renderDiskVisualizer(getCurrentScenario());
      }
      soundFX.playSuccess();
      this.appendBlankLine();
      this.appendLine('  100 por ciento completado');
      this.appendLine('DiskPart formateó el volumen correctamente.');
      this.appendBlankLine();
      return;
    }

    if (cmd === 'active') {
      if (d.isGpt) {
        this.appendLine('El disco seleccionado no es un disco MBR fijo. El comando ACTIVE no aplica en GPT.', 'terminal-line-error');
        this.appendBlankLine();
        return;
      }
      if (d.selectedVolume === null) {
        this.appendLine('No hay ningún volumen o partición seleccionada.', 'terminal-line-error');
        this.appendBlankLine();
        return;
      }
      soundFX.playSuccess();
      this.appendBlankLine();
      this.appendLine('DiskPart marcó la partición actual como activa.');
      this.appendBlankLine();
      return;
    }

    this.appendLine(
      `Microsoft DiskPart: comando no reconocido "${trimmed}". Escribe "help" para ver las opciones.`,
      'terminal-line-error'
    );
    this.appendBlankLine();
  }

  /**
   * Simula el intento de reinicio al salir de Windows PE comprobando el estado global del disco.
   */
  cmdExitWinPE() {
    if (!state.disk) return;
    const b = state.disk.boot;
    const isHealthy = b.mbrHealthy && b.bootSectorHealthy && b.bcdHealthy && b.efiHealthy;

    this.appendBlankLine();
    this.appendLine('Cerrando entorno de recuperación Windows PE...');
    if (isHealthy) {
      this.appendLine(
        '[Verificación de arranque] MBR/GPT, sector de arranque y almacén BCD están íntegros.',
        'terminal-line-info'
      );
      this.appendLine('El sistema Windows está listo para arrancar correctamente.', 'terminal-line-strong');
    } else {
      this.appendLine(
        '[Verificación de arranque] Persisten daños en el sector de arranque o almacén BCD.',
        'terminal-line-error'
      );
      this.appendLine(
        'Sigue diagnosticando con bcdedit, diskpart y bootrec, o pulsa "Reiniciar consola" para restablecer el escenario.',
        'terminal-line-muted'
      );
    }
    this.appendBlankLine();
  }

  printHelp() {
    const scenario = getCurrentScenario();
    this.appendBlankLine();

    if (this.theme === 'winpe') {
      if (this.subMode === 'diskpart') {
        this.executeDiskpartCommand('help');
        return;
      }
      this.appendLine(
        `BootRescueLab — Simulador Windows PE (${scenario.ticketId})`,
        'terminal-line-strong font-semibold'
      );
      this.appendLine('Comandos de rescate y almacenamiento:');
      this.appendLine('  BOOTREC      /fixmbr | /fixboot | /scanos | /rebuildbcd');
      this.appendLine('  BCDBOOT      C:\\Windows [/s <letra:> /f UEFI] Regenera archivos EFI/BCD');
      this.appendLine('  BCDEDIT      [/enum | /store <ruta>] Consulta el almacén BCD');
      this.appendLine('  DISKPART     Abre DiskPart (list vol, select vol, assign letter, detail, format)');
      this.appendLine('  CHKDSK       [C:] Comprueba la integridad del sistema de archivos NTFS/FAT32');
      this.appendBlankLine();
      this.appendLine('Navegación y consola (usa Tab para autocompletar):');
      this.appendLine('  DIR, CD      Lista directorios o cambia de ruta / unidad (C:, X:, S:)');
      this.appendLine('  TYPE, VER    Inspecciona archivos o muestra la versión de WinPE');
      this.appendLine('  CLS, CLEAR   Limpia la pantalla de la consola');
      this.appendLine('  HISTORY      Muestra los comandos ejecutados en la sesión');
      this.appendLine('  EXIT         Sale de DiskPart o verifica el arranque desde WinPE');
    } else {
      this.appendLine(
        `GNU GRUB Rescue — Simulador de rescate (${scenario.ticketId})`,
        'terminal-line-strong font-semibold'
      );
      this.appendLine('Comandos de diagnóstico y reparación GRUB (usa Tab para autocompletar):');
      this.appendLine('  ls                            Lista discos y particiones (ej. (hd0,msdos2))');
      this.appendLine('  ls (hdX,Y)/[ruta]             Explora archivos dentro de una partición');
      this.appendLine('  cat (hdX,Y)/boot/grub/grub.cfg  Muestra la configuración de menú GRUB');
      this.appendLine('  set                           Muestra las variables actuales (prefix, root)');
      this.appendLine('  set root=(hdX,Y)              Establece la partición raíz de arranque');
      this.appendLine('  set prefix=(hdX,Y)/boot/grub  Define la ruta de módulos de GRUB');
      this.appendLine('  insmod normal                 Carga normal.mod si root/prefix son válidos');
      this.appendLine('  normal                        Inicia el menú normal de GRUB');
      this.appendBlankLine();
      this.appendLine('Consola:');
      this.appendLine('  clear, cls / history / reboot Limpia consola, lista historial o reinicia');
    }

    this.appendBlankLine();
  }

  printHistory() {
    this.appendBlankLine();
    if (this.history.length === 0) {
      this.appendLine('El historial de comandos está vacío.', 'terminal-line-muted');
    } else {
      this.history.forEach((entry, idx) => {
        const indexStr = String(idx + 1).padStart(3, ' ');
        this.appendLine(`  ${indexStr}  ${entry}`);
      });
    }
    this.appendBlankLine();
  }

  /**
   * @param {string} commandName
   */
  printUnknownCommand(commandName) {
    state.errorCount += 1;
    if (this.theme === 'winpe') {
      this.appendLine(
        `'${commandName}' no se reconoce como un comando interno o externo,`,
        'terminal-line-error'
      );
      this.appendLine('programa o archivo por lotes ejecutable.', 'terminal-line-error');
      this.appendLine('Escribe "help" para consultar los comandos disponibles.', 'terminal-line-muted');
    } else {
      this.appendLine(`Unknown command '${commandName}'.`, 'terminal-line-error');
      this.appendLine('Escribe "help" para consultar los comandos disponibles de GRUB Rescue.', 'terminal-line-muted');
    }
    this.appendBlankLine();
  }
}

const terminal = new TerminalEngine();

/**
 * Actualiza el contador de progreso CTF y botón de reapertura de flag.
 */
function updateProgressUI() {
  const solvedCount = Object.keys(state.solvedScenarios).length;
  if (dom.ctfProgress) {
    dom.ctfProgress.textContent = `${solvedCount} / ${SCENARIOS.length} resueltos`;
  }
  if (dom.btnReopenVictory) {
    const isCurrentSolved = Boolean(state.solvedScenarios[state.currentScenarioId]);
    dom.btnReopenVictory.classList.toggle('hidden', !isCurrentSolved);
  }
  if (dom.btnResetProgress) {
    dom.btnResetProgress.classList.toggle('hidden', solvedCount === 0);
  }
}

/**
 * Evalúa si se cumplen las condiciones de victoria del escenario activo.
 * @param {Scenario} scenario
 * @param {GlobalDiskState} disk
 */
function isScenarioSolved(scenario, disk) {
  if (scenario.id === 'winpe-mbr-corrupt') {
    return disk.boot.mbrHealthy === true;
  }
  if (scenario.id === 'winpe-efi-bcd') {
    return disk.boot.bcdHealthy === true && disk.boot.efiHealthy === true;
  }
  if (scenario.id === 'grub-dualboot-broken') {
    return disk.grub.booted === true;
  }
  return false;
}

/**
 * Comprueba la victoria tras un comando reparador y muestra el modal CTF si procede.
 */
function evaluateScenarioVictory() {
  if (!state.disk) return;
  const scenario = getCurrentScenario();
  if (state.disk.solved) return;

  if (!isScenarioSolved(scenario, state.disk)) return;

  state.disk.solved = true;
  const penaltyErrors = state.errorCount * 40;
  const penaltySteps = Math.max(0, state.commandCount - 4) * 15;
  const penaltyHints = state.hintsRevealed * 40;
  const score = Math.max(500, 1000 - penaltyErrors - penaltySteps - penaltyHints);

  state.solvedScenarios[scenario.id] = {
    flag: scenario.flag,
    score,
    commandsUsed: state.commandCount,
  };
  saveProgress(state.solvedScenarios);

  soundFX.playVictory();
  renderScenarioSelector();
  updateProgressUI();
  openVictoryModal(scenario, state.solvedScenarios[scenario.id]);
}

/**
 * Muestra el modal CTF de "¡Avería Resuelta!".
 * @param {Scenario} scenario
 * @param {SolvedRecord} record
 */
function openVictoryModal(scenario, record) {
  if (!dom.victoryModal) return;

  if (dom.victoryCaseMeta) {
    dom.victoryCaseMeta.textContent = `${scenario.ticketId} · ${scenario.envName}`;
  }
  if (dom.victorySummary) {
    dom.victorySummary.textContent = scenario.victorySummary;
  }
  if (dom.victoryFlag) {
    dom.victoryFlag.textContent = record.flag;
  }
  if (dom.victoryScore) {
    dom.victoryScore.textContent = `${record.score} / 1000 pts`;
  }
  if (dom.victoryCommands) {
    dom.victoryCommands.textContent = String(record.commandsUsed);
  }
  if (dom.victoryProgress) {
    const totalSolved = Object.keys(state.solvedScenarios).length;
    dom.victoryProgress.textContent = `${totalSolved} / ${SCENARIOS.length}`;
  }

  if (dom.btnCopyFlag) {
    dom.btnCopyFlag.textContent = 'Copiar flag';
  }

  if (dom.btnVictoryNext) {
    const nextUnsolved = SCENARIOS.find((s) => !state.solvedScenarios[s.id]);
    const currentIndex = SCENARIOS.findIndex((s) => s.id === scenario.id);
    const nextScenario = nextUnsolved || SCENARIOS[(currentIndex + 1) % SCENARIOS.length];
    dom.btnVictoryNext.textContent =
      nextScenario.id === scenario.id ? 'Repetir caso' : `Ir a ${nextScenario.shortLabel}`;
  }

  dom.victoryModal.classList.remove('hidden');
  dom.victoryModal.classList.add('flex');
}

function closeVictoryModal() {
  if (!dom.victoryModal) return;
  dom.victoryModal.classList.add('hidden');
  dom.victoryModal.classList.remove('flex');
  if (dom.terminalInput) {
    dom.terminalInput.focus();
  }
}

/**
 * Renderiza los botones selectores de escenario.
 */
function renderScenarioSelector() {
  if (!dom.scenarioSelector) return;
  dom.scenarioSelector.innerHTML = '';

  SCENARIOS.forEach((scenario) => {
    const isActive = scenario.id === state.currentScenarioId;
    const isSolved = Boolean(state.solvedScenarios[scenario.id]);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', String(isActive));
    btn.className = isActive
      ? 'flex min-h-[58px] w-full cursor-pointer flex-col items-start justify-center rounded-lg border border-sky-600 bg-sky-50/70 px-3 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600'
      : 'flex min-h-[58px] w-full cursor-pointer flex-col items-start justify-center rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600';

    const topRow = createEl('div', 'flex w-full items-center justify-between gap-1.5');
    const codeSpan = createEl(
      'span',
      `font-mono text-[11px] font-semibold truncate ${isActive ? 'text-sky-700' : 'text-slate-500'}`,
      scenario.envName
    );
    const statusLabel = isSolved ? 'Resuelto' : scenario.firmware.split('/')[0].trim();
    const schemeSpan = createEl(
      'span',
      `text-[11px] whitespace-nowrap font-medium ${isSolved ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`,
      statusLabel
    );
    topRow.appendChild(codeSpan);
    topRow.appendChild(schemeSpan);

    const titleSpan = createEl(
      'span',
      `mt-0.5 truncate w-full text-xs font-semibold sm:text-[13px] ${
        isActive ? 'text-slate-950' : 'text-slate-800'
      }`,
      scenario.shortLabel
    );

    btn.appendChild(topRow);
    btn.appendChild(titleSpan);

    btn.addEventListener('click', () => {
      if (state.currentScenarioId === scenario.id) return;
      selectScenario(scenario.id);
    });

    dom.scenarioSelector.appendChild(btn);
  });
}

/**
 * Renderiza el área del ticket de soporte del escenario activo.
 * @param {Scenario} scenario
 */
function renderTicket(scenario) {
  if (dom.ticketId) dom.ticketId.textContent = `Ticket #${scenario.ticketId}`;
  if (dom.ticketEnv) dom.ticketEnv.textContent = scenario.envName;
  if (dom.ticketFirmware) dom.ticketFirmware.textContent = scenario.firmware;
  if (dom.ticketErrorCode) dom.ticketErrorCode.textContent = scenario.errorCode;
  if (dom.ticketTitle) dom.ticketTitle.textContent = scenario.title;
  if (dom.ticketSummary) dom.ticketSummary.textContent = scenario.summary;
  if (dom.ticketSymptom) dom.ticketSymptom.textContent = scenario.symptom;
  if (dom.ticketObjective) dom.ticketObjective.textContent = scenario.objective;
  renderHints(scenario);
  renderCommandReference(scenario);
}

/**
 * Renderiza las pistas progresivas del escenario actual.
 * @param {Scenario} scenario
 */
function renderHints(scenario) {
  const totalHints = scenario.hints.length;
  if (dom.btnRevealHint) {
    const remaining = state.hintsRevealed < totalHints;
    dom.btnRevealHint.textContent = remaining
      ? `Mostrar pista (${state.hintsRevealed}/${totalHints})`
      : `Todas las pistas mostradas (${totalHints}/${totalHints})`;
    dom.btnRevealHint.disabled = !remaining;
    dom.btnRevealHint.classList.toggle('opacity-50', !remaining);
    dom.btnRevealHint.classList.toggle('cursor-not-allowed', !remaining);
  }

  if (dom.hintList) {
    dom.hintList.innerHTML = '';
    if (state.hintsRevealed === 0) {
      dom.hintList.classList.add('hidden');
      return;
    }
    dom.hintList.classList.remove('hidden');
    scenario.hints.slice(0, state.hintsRevealed).forEach((hintText, idx) => {
      const li = createEl('li', 'rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700');
      const prefix = createEl('span', 'font-semibold text-sky-700 mr-1.5', `Pista ${idx + 1}:`);
      li.appendChild(prefix);
      li.appendChild(document.createTextNode(hintText));
      dom.hintList?.appendChild(li);
    });
  }
}

/**
 * Renderiza la guía rápida interactiva de comandos para el entorno activo.
 * @param {Scenario} scenario
 */
function renderCommandReference(scenario) {
  if (!dom.commandReferenceList) return;
  dom.commandReferenceList.innerHTML = '';

  const entries =
    scenario.theme === 'winpe'
      ? [
          ['bootrec /fixmbr', 'Reescribe el código maestro de arranque (MBR) en el Sector 0.'],
          ['bootrec /fixboot', 'Escribe un nuevo sector de arranque en la partición del sistema.'],
          ['bootrec /rebuildbcd', 'Busca instalaciones de Windows y reconstruye el almacén BCD.'],
          ['bcdedit', 'Muestra las entradas actuales del almacén BCD o detecta errores.'],
          ['diskpart', 'Abre DiskPart (list vol, select vol 0, assign letter=S, exit).'],
          ['bcdboot C:\\Windows /s S: /f UEFI', 'Copia archivos de arranque UEFI y genera BCD en S:.'],
        ]
      : [
          ['ls', 'Lista discos y particiones visibles para GRUB (ej. (hd0,msdos2)).'],
          ['ls (hd0,msdos2)/boot/grub', 'Comprueba el contenido de /boot/grub en la partición ext4.'],
          ['set', 'Muestra las variables actuales de GRUB ($root, $prefix, $cmdpath).'],
          ['set root=(hd0,msdos2)', 'Apunta $root hacia la partición Linux correcta.'],
          ['set prefix=(hd0,msdos2)/boot/grub', 'Apunta $prefix al directorio de módulos de GRUB.'],
          ['insmod normal', 'Carga el módulo normal.mod desde la ruta configurada.'],
          ['normal', 'Arranca el menú normal de GNU GRUB.'],
        ];

  entries.forEach(([cmdText, descText]) => {
    const row = createEl(
      'div',
      'flex flex-col gap-1 rounded-md border border-slate-200 bg-white px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3'
    );
    const btn = createEl(
      'button',
      'cursor-pointer text-left font-mono text-[11.5px] font-semibold text-sky-700 hover:text-sky-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 shrink-0',
      cmdText
    );
    btn.type = 'button';
    btn.addEventListener('click', () => {
      const input = /** @type {HTMLInputElement | null} */ (dom.terminalInput);
      if (!input) return;
      input.value = cmdText;
      input.focus();
      const end = cmdText.length;
      input.setSelectionRange(end, end);
      terminal.syncMirror();
      soundFX.playKey();
    });

    const desc = createEl('span', 'text-xs text-slate-600', descText);
    row.appendChild(btn);
    row.appendChild(desc);
    dom.commandReferenceList?.appendChild(row);
  });
}

/**
 * Sincroniza el botón de encendido/apagado de efectos de sonido.
 */
function updateSoundToggleUI() {
  if (!dom.btnSoundToggle) return;
  const enabled = soundFX.enabled;
  dom.btnSoundToggle.setAttribute('aria-pressed', String(enabled));
  if (dom.soundIconOn) dom.soundIconOn.classList.toggle('hidden', !enabled);
  if (dom.soundIconOff) dom.soundIconOff.classList.toggle('hidden', enabled);
  if (dom.soundToggleLabel) {
    dom.soundToggleLabel.textContent = enabled ? 'Sonido' : 'Silencio';
  }
}

/**
 * Construye los nodos visuales de la secuencia de arranque en tiempo real.
 * @param {Scenario} scenario
 * @param {GlobalDiskState | null} disk
 * @returns {Array<{ step: string, title: string, status: HealthState, statusLabel: string }>}
 */
function getBootChainSteps(scenario, disk) {
  if (!disk) return [];

  if (scenario.id === 'winpe-mbr-corrupt') {
    return [
      { step: '1', title: 'BIOS Legacy', status: 'ok', statusLabel: 'POST OK' },
      {
        step: '2',
        title: 'MBR (LBA 0)',
        status: disk.boot.mbrHealthy ? 'ok' : 'damaged',
        statusLabel: disk.boot.mbrHealthy ? 'Íntegro' : 'Corrupto',
      },
      {
        step: '3',
        title: 'PBR / BCD',
        status: disk.boot.mbrHealthy ? 'ok' : 'warning',
        statusLabel: disk.boot.mbrHealthy ? 'Accesible' : 'Bloqueado',
      },
      {
        step: '4',
        title: 'Windows (C:)',
        status: disk.boot.mbrHealthy ? 'ok' : 'warning',
        statusLabel: disk.boot.mbrHealthy ? 'Arrancable' : 'En espera',
      },
    ];
  }

  if (scenario.id === 'winpe-efi-bcd') {
    const efiOk = disk.boot.bcdHealthy && disk.boot.efiHealthy;
    return [
      { step: '1', title: 'Firmware UEFI', status: 'ok', statusLabel: 'NVRAM OK' },
      { step: '2', title: 'Tabla GPT', status: 'ok', statusLabel: 'CRC32 OK' },
      {
        step: '3',
        title: 'EFI / BCD',
        status: efiOk ? 'ok' : disk.boot.bcdHealthy ? 'warning' : 'damaged',
        statusLabel: efiOk ? 'Íntegro' : '0xc0000098',
      },
      {
        step: '4',
        title: 'winload.efi',
        status: efiOk ? 'ok' : 'warning',
        statusLabel: efiOk ? 'Listo' : 'Bloqueado',
      },
    ];
  }

  const g = disk.grub;
  const configured = isGrubEnvConfiguredCorrectly(g);
  return [
    { step: '1', title: 'BIOS / MBR', status: 'ok', statusLabel: 'core.img OK' },
    {
      step: '2',
      title: '$root / $prefix',
      status: g.booted || configured ? 'ok' : 'damaged',
      statusLabel: configured ? '(hd0,msdos2)' : '(hd0,msdos3)',
    },
    {
      step: '3',
      title: 'normal.mod',
      status: g.booted || g.normalLoaded ? 'ok' : configured ? 'warning' : 'damaged',
      statusLabel: g.normalLoaded ? 'Cargado' : configured ? 'Pendiente' : 'No hallado',
    },
    {
      step: '4',
      title: 'Menú GRUB',
      status: g.booted ? 'ok' : g.normalLoaded ? 'warning' : 'damaged',
      statusLabel: g.booted ? 'Iniciado' : 'En rescate',
    },
  ];
}

/**
 * Comprueba si un elemento acaba de ser reparado para animar su paso de rojo/ámbar a verde.
 * @param {string} key
 * @param {HealthState} currentStatus
 */
function checkRepairedTransition(key, currentStatus) {
  const prev = state.lastHealthMap[key];
  state.lastHealthMap[key] = currentStatus;
  return Boolean(prev && prev !== 'ok' && currentStatus === 'ok');
}

/**
 * Renderiza la visualización gráfica del disco duro leyendo el estado global mutable del Disco 0.
 * @param {Scenario} scenario
 */
function renderDiskVisualizer(scenario) {
  if (dom.diskHardwareMeta) dom.diskHardwareMeta.textContent = scenario.hardwareMeta;
  if (dom.diskSchemeLabel) dom.diskSchemeLabel.textContent = scenario.partitionScheme;
  if (dom.diskTotalLba) dom.diskTotalLba.textContent = scenario.totalLba;

  const bootStructures = state.disk ? state.disk.bootStructures : scenario.bootStructures;
  const partitions = state.disk ? state.disk.partitions : scenario.partitions;
  const volumes = state.disk ? state.disk.volumes : [];

  // 0. Indicador de estado general del disco en la cabecera del chasis
  if (dom.diskOverallStatus && state.disk) {
    const solved = isScenarioSolved(scenario, state.disk);
    const hasDamaged =
      bootStructures.some((b) => b.status === 'damaged') ||
      partitions.some((p) => p.status === 'damaged');
    const overallStatus = solved ? 'ok' : hasDamaged ? 'damaged' : 'warning';
    const visuals = getStatusVisuals(overallStatus);
    const labelText = solved
      ? 'Arranque operativo'
      : hasDamaged
        ? 'Fallo de arranque'
        : 'Reparación parcial';

    dom.diskOverallStatus.className = `flex items-center gap-1.5 text-xs font-semibold ${visuals.badgeTextClass}`;
    dom.diskOverallStatus.innerHTML = visuals.iconSvg;
    dom.diskOverallStatus.appendChild(createEl('span', '', labelText));
  }

  // 1. Cadena de secuencia de arranque en tiempo real
  if (dom.diskBootChain) {
    dom.diskBootChain.innerHTML = '';
    const steps = getBootChainSteps(scenario, state.disk);
    steps.forEach((node) => {
      const visuals = getStatusVisuals(node.status);
      const justRepaired = checkRepairedTransition(`chain:${node.title}`, node.status);
      const item = createEl(
        'div',
        `rounded-md border px-2.5 py-2 ${visuals.boxSurfaceClass} ${justRepaired ? 'sector-repaired-pop' : ''}`
      );
      const top = createEl('div', 'flex items-center justify-between gap-1');
      top.appendChild(
        createEl('span', 'font-mono text-[10px] font-semibold text-slate-500', `PASO ${node.step}`)
      );
      const iconWrap = createEl('span', 'inline-flex items-center');
      iconWrap.innerHTML = visuals.iconSvg;
      top.appendChild(iconWrap);

      const title = createEl('div', 'mt-0.5 truncate text-xs font-semibold text-slate-900', node.title);
      const status = createEl(
        'div',
        `truncate font-mono text-[11px] font-medium ${visuals.badgeTextClass}`,
        node.statusLabel
      );

      item.appendChild(top);
      item.appendChild(title);
      item.appendChild(status);
      dom.diskBootChain.appendChild(item);
    });
  }

  // 2. Bloques críticos de cabecera (MBR / GPT / EFI / GRUB) interactivos
  if (dom.diskBootStructures) {
    dom.diskBootStructures.innerHTML = '';
    bootStructures.forEach((struct) => {
      const visuals = getStatusVisuals(struct.status);
      const isSelected = state.selectedStructureId === struct.id;
      const justRepaired = checkRepairedTransition(`struct:${struct.id}`, struct.status);
      const selectionRing = isSelected
        ? 'ring-2 ring-sky-600 ring-offset-1'
        : 'hover:border-slate-400';

      const card = document.createElement('button');
      card.type = 'button';
      card.setAttribute('aria-pressed', String(isSelected));
      card.className = `flex w-full cursor-pointer flex-col items-stretch rounded-lg border p-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${visuals.boxSurfaceClass} ${selectionRing} ${justRepaired ? 'sector-repaired-pop' : ''}`;

      const header = createEl('div', 'flex w-full items-start justify-between gap-2');
      const title = createEl('div', 'text-xs font-semibold text-slate-900', struct.name);
      const statusWrap = createEl(
        'div',
        `flex shrink-0 items-center gap-1 text-xs font-semibold ${visuals.badgeTextClass}`
      );
      statusWrap.innerHTML = visuals.iconSvg;
      statusWrap.appendChild(createEl('span', '', struct.statusLabel));

      header.appendChild(title);
      header.appendChild(statusWrap);

      const role = createEl('div', 'mt-0.5 text-[11px] font-medium text-slate-500', struct.role);
      const detail = createEl('p', 'mt-1.5 text-xs leading-relaxed text-slate-700', struct.detail);

      card.appendChild(header);
      card.appendChild(role);
      card.appendChild(detail);

      card.addEventListener('click', () => {
        state.selectedStructureId = struct.id;
        renderDiskVisualizer(scenario);
      });

      dom.diskBootStructures.appendChild(card);
    });
  }

  // 3. Mapa físico de sectores: Bloque LBA 0 (MBR/GPT) + Barra proporcional de particiones
  if (dom.diskPartitionBar) {
    dom.diskPartitionBar.innerHTML = '';

    // Bloque físico LBA 0 (MBR / Protective GPT) al inicio del disco
    const primaryStruct = bootStructures[0];
    if (primaryStruct) {
      const lbaVisuals = getStatusVisuals(primaryStruct.status);
      const isLbaSelected = state.selectedStructureId === primaryStruct.id;
      const lbaRepaired = checkRepairedTransition(`lba0:${primaryStruct.id}`, primaryStruct.status);
      const lbaRing = isLbaSelected
        ? 'ring-2 ring-sky-600 ring-offset-1'
        : 'hover:border-slate-400';

      const lbaBtn = document.createElement('button');
      lbaBtn.type = 'button';
      lbaBtn.setAttribute('aria-pressed', String(isLbaSelected));
      lbaBtn.className = `flex min-h-[72px] shrink-0 cursor-pointer flex-col justify-between rounded-md border p-2 text-left sm:w-[82px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${lbaVisuals.surfaceClass} ${lbaRing} ${lbaRepaired ? 'sector-repaired-pop' : ''}`;

      const top = createEl('div', 'flex w-full items-center justify-between gap-1');
      top.appendChild(createEl('span', 'font-mono text-[10px] font-bold text-slate-700', 'LBA 0'));
      const iconBox = createEl('span', 'inline-flex items-center');
      iconBox.innerHTML = lbaVisuals.iconSvg;
      top.appendChild(iconBox);

      const mid = createEl(
        'div',
        'mt-1 truncate font-mono text-xs font-bold text-slate-900',
        state.disk?.isGpt ? 'GPT' : 'MBR'
      );
      const bot = createEl(
        'div',
        `mt-0.5 truncate text-[10px] font-semibold ${lbaVisuals.badgeTextClass}`,
        primaryStruct.statusLabel
      );

      lbaBtn.appendChild(top);
      lbaBtn.appendChild(mid);
      lbaBtn.appendChild(bot);

      lbaBtn.addEventListener('click', () => {
        state.selectedStructureId = primaryStruct.id;
        renderDiskVisualizer(scenario);
      });

      dom.diskPartitionBar.appendChild(lbaBtn);
    }

    partitions.forEach((part) => {
      const visuals = getStatusVisuals(part.status);
      const isSelected = !state.selectedStructureId && part.id === state.selectedPartitionId;
      const mountedVol = volumes.find((v) => v.partitionId === part.id);
      const letterBadge = mountedVol?.letter ? ` (${mountedVol.letter}:)` : '';
      const partRepaired = checkRepairedTransition(`part:${part.id}`, part.status);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.style.flexGrow = String(part.visualWeight);
      btn.style.flexBasis = '0';
      btn.setAttribute('aria-pressed', String(isSelected));

      const selectionRing = isSelected
        ? 'ring-2 ring-sky-600 ring-offset-1'
        : 'hover:border-slate-400';

      btn.className = `flex min-h-[72px] min-w-[84px] cursor-pointer flex-col justify-between rounded-md border p-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${visuals.surfaceClass} ${selectionRing} ${partRepaired ? 'sector-repaired-pop' : ''}`;

      const top = createEl('div', 'flex w-full items-center justify-between gap-1.5');
      const code = createEl(
        'span',
        'font-mono text-[11px] font-semibold text-slate-600',
        `${part.code}${letterBadge}`
      );
      const iconBox = createEl('span', 'inline-flex items-center gap-1');
      iconBox.innerHTML = visuals.iconSvg;
      top.appendChild(code);
      top.appendChild(iconBox);

      const mid = createEl(
        'div',
        'mt-1 truncate text-xs font-semibold text-slate-900',
        part.label
      );
      const bot = createEl(
        'div',
        'mt-0.5 flex items-center justify-between gap-1 font-mono text-[11px] text-slate-600'
      );
      bot.appendChild(createEl('span', 'truncate', part.fs));
      bot.appendChild(createEl('span', 'shrink-0', part.size));

      btn.appendChild(top);
      btn.appendChild(mid);
      btn.appendChild(bot);

      btn.addEventListener('click', () => {
        state.selectedStructureId = null;
        state.selectedPartitionId = part.id;
        renderDiskVisualizer(scenario);
      });

      dom.diskPartitionBar.appendChild(btn);
    });
  }

  // 4. Inspector detallado del bloque de arranque o partición seleccionada
  renderPartitionInspector(scenario);
}

/**
 * Muestra los detalles técnicos de la estructura o partición seleccionada en el mapa.
 * @param {Scenario} scenario
 */
function renderPartitionInspector(scenario) {
  if (!dom.partitionInspector) return;

  const bootStructures = state.disk ? state.disk.bootStructures : scenario.bootStructures;
  const selectedStruct = state.selectedStructureId
    ? bootStructures.find((b) => b.id === state.selectedStructureId)
    : null;

  dom.partitionInspector.innerHTML = '';

  if (selectedStruct) {
    const visuals = getStatusVisuals(selectedStruct.status);
    const topRow = createEl('div', 'flex flex-wrap items-center justify-between gap-2');
    const titleGroup = createEl('div', 'flex items-baseline gap-2');
    titleGroup.appendChild(
      createEl('span', 'font-mono text-xs font-semibold text-sky-700', '[ESTRUCTURA DE ARRANQUE]')
    );
    titleGroup.appendChild(createEl('h3', 'text-sm font-bold text-slate-900', selectedStruct.name));

    const statusGroup = createEl(
      'div',
      `flex items-center gap-1.5 text-xs font-semibold ${visuals.badgeTextClass}`
    );
    statusGroup.innerHTML = visuals.iconSvg;
    statusGroup.appendChild(createEl('span', '', selectedStruct.statusLabel));

    topRow.appendChild(titleGroup);
    topRow.appendChild(statusGroup);

    const roleLine = createEl(
      'div',
      'mt-2 border-t border-slate-200 pt-2 text-xs font-medium text-slate-600',
      `Función: ${selectedStruct.role}`
    );
    const detailLine = createEl(
      'p',
      'mt-2 text-xs leading-relaxed text-slate-700',
      selectedStruct.detail
    );

    const techSpecs = getStructureTechSpecs(selectedStruct.id, state.disk);
    if (techSpecs.length > 0) {
      const metaGrid = createEl(
        'dl',
        'mt-3 grid grid-cols-1 gap-x-4 gap-y-2 border-t border-slate-200 pt-2.5 text-xs sm:grid-cols-3'
      );
      techSpecs.forEach(([label, val]) => {
        const item = createEl('div', '');
        item.appendChild(createEl('dt', 'text-slate-500', label));
        item.appendChild(createEl('dd', 'mt-0.5 font-mono font-medium text-slate-900', val));
        metaGrid.appendChild(item);
      });
      dom.partitionInspector.appendChild(topRow);
      dom.partitionInspector.appendChild(roleLine);
      dom.partitionInspector.appendChild(metaGrid);
      dom.partitionInspector.appendChild(detailLine);
      return;
    }

    dom.partitionInspector.appendChild(topRow);
    dom.partitionInspector.appendChild(roleLine);
    dom.partitionInspector.appendChild(detailLine);
    return;
  }

  const partitions = state.disk ? state.disk.partitions : scenario.partitions;
  const part =
    partitions.find((p) => p.id === state.selectedPartitionId) || partitions[0];
  if (!part) return;

  const mountedVol = state.disk?.volumes.find((v) => v.partitionId === part.id);
  const letterText = mountedVol?.letter ? ` · Unidad ${mountedVol.letter}:` : '';

  const visuals = getStatusVisuals(part.status);

  const topRow = createEl('div', 'flex flex-wrap items-center justify-between gap-2');
  const titleGroup = createEl('div', 'flex items-baseline gap-2');
  titleGroup.appendChild(
    createEl('span', 'font-mono text-xs font-semibold text-sky-700', `[${part.code}${letterText}]`)
  );
  titleGroup.appendChild(createEl('h3', 'text-sm font-bold text-slate-900', part.label));

  const statusGroup = createEl(
    'div',
    `flex items-center gap-1.5 text-xs font-semibold ${visuals.badgeTextClass}`
  );
  statusGroup.innerHTML = visuals.iconSvg;
  statusGroup.appendChild(createEl('span', '', part.statusLabel));

  topRow.appendChild(titleGroup);
  topRow.appendChild(statusGroup);

  const metaGrid = createEl(
    'dl',
    'mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-slate-200 pt-3 text-xs sm:grid-cols-4'
  );

  const specs = [
    ['Sistema de archivos', part.fs],
    ['Tamaño', part.size],
    ['Rango LBA', part.lbaRange],
    ['Atributos / Flags', part.flags],
  ];

  specs.forEach(([label, val]) => {
    const item = createEl('div', '');
    item.appendChild(createEl('dt', 'text-slate-500', label));
    item.appendChild(createEl('dd', 'mt-0.5 font-mono font-medium text-slate-900', val));
    metaGrid.appendChild(item);
  });

  const diagnosis = createEl(
    'p',
    'mt-3 border-t border-slate-200 pt-2.5 text-xs leading-relaxed text-slate-700',
    part.diagnosis
  );

  dom.partitionInspector.appendChild(topRow);
  dom.partitionInspector.appendChild(metaGrid);
  dom.partitionInspector.appendChild(diagnosis);
}

/**
 * Devuelve telemetría técnica de bajo nivel para la estructura de arranque inspeccionada.
 * @param {string} structId
 * @param {GlobalDiskState | null} disk
 * @returns {Array<[string, string]>}
 */
function getStructureTechSpecs(structId, disk) {
  if (!disk) return [];
  if (structId === 'mbr-sector-0') {
    return [
      ['Offset / Tamaño', 'LBA 0 · 512 bytes'],
      ['Firma fin de sector', disk.boot.mbrHealthy ? '0x55AA (Válida)' : '0x0000 (Corrupta)'],
      ['Bootstrap (446B)', disk.boot.mbrHealthy ? 'NT6 MBR Code OK' : 'Truncado / Ilegible'],
    ];
  }
  if (structId === 'efi-bcd') {
    return [
      ['Ruta EFI', '\\EFI\\Microsoft\\Boot\\BCD'],
      ['Estado almacén', disk.boot.bcdHealthy ? 'Hive válido (2 entradas)' : 'Error 0xc0000098'],
      ['Cargador destino', '\\Windows\\system32\\winload.efi'],
    ];
  }
  if (structId === 'grub-prefix') {
    return [
      ['Variable $root', `(${disk.grub.root})`],
      ['Variable $prefix', disk.grub.prefix],
      ['normal.mod', disk.grub.normalLoaded ? 'Cargado en memoria' : 'No cargado'],
    ];
  }
  return [];
}

/**
 * Selecciona un escenario, inicializa el estado global del Disco 0 y reinicia la consola.
 * @param {string} scenarioId
 */
function selectScenario(scenarioId) {
  const scenario = SCENARIOS.find((s) => s.id === scenarioId);
  if (!scenario) return;

  state.currentScenarioId = scenario.id;
  state.disk = createDiskStateFromScenario(scenario);
  state.commandCount = 0;
  state.errorCount = 0;
  state.hintsRevealed = 0;
  state.lastHealthMap = {};

  // Seleccionar por defecto la estructura o partición con incidencia
  const damagedStruct = state.disk.bootStructures.find((b) => b.status === 'damaged');
  const problematicPart = state.disk.partitions.find((p) => p.status !== 'ok');
  state.selectedStructureId = damagedStruct ? damagedStruct.id : null;
  state.selectedPartitionId = problematicPart
    ? problematicPart.id
    : state.disk.partitions[0].id;

  renderScenarioSelector();
  updateProgressUI();
  renderTicket(scenario);
  renderDiskVisualizer(scenario);
  terminal.resetForScenario(scenario, false);
}

/**
 * Eventos del modal CTF de "¡Avería Resuelta!" y controles de pistas/progreso.
 */
function bindModalEvents() {
  if (dom.btnRevealHint) {
    dom.btnRevealHint.addEventListener('click', () => {
      const scenario = getCurrentScenario();
      if (state.hintsRevealed < scenario.hints.length) {
        state.hintsRevealed += 1;
        soundFX.playKey();
        renderHints(scenario);
      }
    });
  }

  if (dom.btnResetProgress) {
    dom.btnResetProgress.addEventListener('click', () => {
      state.solvedScenarios = {};
      saveProgress(state.solvedScenarios);
      soundFX.playKey();
      selectScenario(state.currentScenarioId);
    });
  }

  if (dom.btnVictoryClose) {
    dom.btnVictoryClose.addEventListener('click', closeVictoryModal);
  }
  if (dom.btnVictoryContinue) {
    dom.btnVictoryContinue.addEventListener('click', closeVictoryModal);
  }
  if (dom.victoryModal) {
    dom.victoryModal.addEventListener('click', (event) => {
      if (event.target === dom.victoryModal) {
        closeVictoryModal();
      }
    });
  }
  if (dom.btnVictoryNext) {
    dom.btnVictoryNext.addEventListener('click', () => {
      const nextUnsolved = SCENARIOS.find((s) => !state.solvedScenarios[s.id]);
      const currentIndex = SCENARIOS.findIndex((s) => s.id === state.currentScenarioId);
      const target = nextUnsolved || SCENARIOS[(currentIndex + 1) % SCENARIOS.length];
      closeVictoryModal();
      selectScenario(target.id);
    });
  }
  if (dom.btnReopenVictory) {
    dom.btnReopenVictory.addEventListener('click', () => {
      const scenario = getCurrentScenario();
      const record = state.solvedScenarios[scenario.id];
      if (record) {
        openVictoryModal(scenario, record);
      }
    });
  }
  if (dom.btnCopyFlag) {
    dom.btnCopyFlag.addEventListener('click', async () => {
      const flagText = dom.victoryFlag?.textContent || '';
      if (!flagText) return;
      try {
        await navigator.clipboard.writeText(flagText);
        if (dom.btnCopyFlag) dom.btnCopyFlag.textContent = 'Flag copiada';
      } catch {
        if (dom.btnCopyFlag) dom.btnCopyFlag.textContent = 'Usa Ctrl+C';
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && dom.victoryModal && !dom.victoryModal.classList.contains('hidden')) {
      closeVictoryModal();
    }
  });
}

// Arranque inicial de BootRescueLab
updateSoundToggleUI();
bindModalEvents();
selectScenario(SCENARIOS[0].id);
