/** Illustrative description of resource/*.json
 * Some files are multilingual and only one true version exists as resource/x.json. (battle_data, infrast, config, stages)
 * Other files are monolingual and have multiple versions, e.g. resource/x.json (zh), resource/global/$packageType/resource/x.json (rest). (recruitment, item_index, ocr_config, version) */

/** Strictly, `[0-9xy]-[1-9]?[0-9]`. */
type _BattleDataRangeId = string
/** Bit of a suggestion. */
type _Integer = number

/** Character (and any deployable) data */
type _BattleDataChar = {
  name: string
  name_en: string
  name_jp: string
  name_kr: string
  name_tw: string

  /** If unavailable, the preceeding values are filled with `name` (CN name). */
  name_en_unavailable?: boolean
  name_jp_unavailable?: boolean
  name_kr_unavailable?: boolean
  name_tw_unavailable?: boolean

  position: 'RANGED' | 'MELEE' | 'NONE' | 'ALL'
  profession: 'PIONEER' | 'WARRIOR' | 'TANK' | 'SNIPER' | 'CASTER' | 'SUPPORT' | 'MEDIC' | 'SPECIAL' | 'TRAP' | 'TOKEN'

  /** Corresponds to mastery 0, 1, 2. */
  rangeId: [_BattleDataRangeId, _BattleDataRangeId, _BattleDataRangeId]
  /** Stars. */
  rarity: 1 | 2 | 3 | 4 | 5 | 6
}

type _BattleDataCharKey = `${'char' | 'trap' | 'token'}_${_Integer}_${string}`

/** @see asst::BattleDataConfig */
type BattleDataJson = {
  /** Character data. */
  chars: {
    [K in _BattleDataCharKey]: _BattleDataChar
  }
  /** Attack range patterns referenced by `rangeId` in `_BattleDataChar`. */
  ranges: {
    [K in _BattleDataRangeId]: [_Integer, _Integer][]
  }
}

type _Docs<T> = T & {
  [K in keyof T as `${K & string}_Doc`]: string
}

type _ConfigJsonOptsD = {
  /** Image recognization delay. Lower means more responsive but more CPU intensive.
   * @@defaultValue `500` */
  taskDelay: number
  /** Minimal interval (ms) between two SSS fight screencaps.
   * @defaultValue `16` (~60fps). */
  SSSFightScreencapInterval: number
  /** Minimal interval (ms) between two Roguelike fight screencaps
   * @defaultValue `100`. */
  RoguelikeFightScreencapInterval: number
  /** Minimal interval (ms) between two screencaps for all other copilot fights.
   * @defaultValue `16` (~60fps). */
  CopilotFightScreencapInterval: number
  /** Random delay (ms), may help evade detection.
   * @defaultValue `[0, 0]` (no delay). */
  controlDelayRange: [number, number]
  /** Use an extra swipe to work around a bug where swipes occasionally overshoot (px, ms).
   * @defaultValue `100` */
  adbExtraSwipeDist: number
  /** @defaultValue `500` */
  adbExtraSwipeDuration: number
  /** @defaultValue `10.0` */
  adbSwipeDurationMultiplier: number
  /** @defaultValue `0.8` */
  adbSwipeXDistanceMultiplier: number
  /** @defaultValue `200` (ms) */
  minitouchSwipeDefaultDuration: number
  /** @defaultValue `150` (ms) */
  minitouchSwipeExtraEndDelay: number
  /** @defaultValue `100` (px) */
  minitouchExtraSwipeDist: number
  /** @defaultValue `200` (ms) */
  minitouchExtraSwipeDuration: number
  /** Search order for minitouch program.
   * @defaultValue `["x86_64", "x86", "arm64-v8a", "armeabi-v7a", "armeabi"]`. */
  minitouchProgramsOrder: string[]
  /** If using pause on operator deployment swipe, the minimum distance (px) required to trigger a pause.
   * @defaultValue `20` */
  swipeWithPauseRequiredDistance: number
}

type _ConfigJsonOptsRest = {
  /** 企鹅物流汇报: https://penguin-stats.cn/ */
  penguinReport: {
    Doc?: string
    /** @defaultValue `"https://penguin-stats.io/PenguinStats/api/v2/report"` */
    url: string
    url_Doc?: string
  }
  /** 一图流汇报：https://ark.yituliu.cn/survey/maarecruitdata */
  yituliuReport: {
    Doc?: string
    /** @defaultValue `"https://backend.yituliu.cn/maa/upload/recruit"` */
    recruitUrl: string
    /** @defaultValue `"https://backend.yituliu.cn/maa/upload/stageDrop"` */
    dropUrl: string
  }
  debug: {
    /** Run save_debug_image cleanup every N saves. Defaults to 5. */
    cleanFilesFreq: number
    /** Maximum number of debug images to keep. Defaults to 10. */
    maxDebugFileNum: number
  }
}

type PackageType = 'Official' | 'Bilibili' | 'YoStarEN' | 'YoStarJP' | 'YoStarKR' | 'txwy'

/** options for AdbCfg
 * Most device/emulator connection behavior are configured here.
 * However, some options are instead based on "magical" configNames. */
type _ConfigJsonConnection = {
  /** Name of the connection config.
   * Magical names include:
   * - `DEBUG`: pseudo-config when built with ASST_DEBUG.
   * - `AVD`: special handling in MaaFwAdbController, determines whether to pass `{extra: ...}` to `MaaAdbControlUnitCreate`.
   * - `MuMuEmulator12`: special handling in AdbController, see `AdbController::init_mumu_extras`.
   * - `LDPlayer`: special handling in AdbController, see `AdbController::init_ld_extras`.
   * - `MacSCK`: (not in config.json) special handling in PlayToolsController, requests screenshot with ScreenCaptureKit instead of by PlayTools (RGBA).
   * - `MacBGR`: (not in config.json) special handling in PlayToolsController, requests screenshot with PlayTools (BGR) instead of by PlayTools (RGBA). */
  configName: string

  /** Inheritance, if any */
  baseConfig?: string

  /** Commands to achieve certain goals. */
  devices?: string
  connect?: string
  uuid?: string
  version?: string
  display?: string
  ncAddress?: string
  abilist?: string
  orientation?: string
  pushMinitouch?: string
  chmodMinitouch?: string
  callMinitouch?: string
  callMaatouch?: string
  screencapRawByNC?: string
  screencapRawWithGzip?: string
  screencapEncode?: string
  click?: string
  swipe?: string
  input?: string
  start?: string
  stop?: string
  back_to_home?: string
  release?: string
  pressEsc?: string

  /** Parses `devices`. */
  addressRegex?: string
  /** Parses `display`. */
  displayFormat?: string
}

/** @see asst::GeneralConfig */
export type ConfigJson = {
  version: string
  options: _ConfigJsonOptsD & _Docs<_ConfigJsonOptsD> & _ConfigJsonOptsRest
  packageName: {
    [K in PackageType]: string
  }
  connection: Array<_ConfigJsonConnection>
}

/** asst::Status
 * Not included:
 * - OCR task name (rect)
 * - `InfrastAvailableOpersForGroup` (string)
 * - `#LastTime#${string}` (number)
 * - `StageDropsTaskPluginRestrictions` (number) */
export type Status = {
  /** InfrastInfoTask::_run */
  [K in _InfrastRoom as `NumOf${K}`]: _Integer
}

type _OneSeven = 1 | 2 | 3 | 4 | 5 | 6 | 7
type _InfrastProducts =
  | `Money`
  | `SyntheticJade`
  | `CombatRecord`
  | `PureGold`
  | `OriginStone`
  | `Chip`
  | `HR`
  | `MoodAddition`
  | `General`
  | `Drone`
  | `No${_OneSeven}`
type _InfrastBskillSite = `ctrl` | `dorm` | `formula` | `man` | `hire` | `tra`
type _InfrastBskill = `bskill_${_InfrastBskillSite}_${string}`
type _InfrastEfficiency = {
  /** Simple number for product */
  [K in _InfrastProducts | `all`]: number
} & {
  /** Arithmetic expression with variables in "Status" (not a regex)
   * @see asst::infrast::Skill.efficient_regex
   * @see asst::InfrastProductionTask.efficient_regex_calc() */
  [K in _InfrastProducts | `all` as `${K}_reg`]: string
}

type _InfrastSkill = {
  // Informative
  desc: string[]
  name: string[]

  /** Simplified efficiency calc: assume no special dependencies are met! */
  efficient: _InfrastEfficiency
  /** -> template/infrast/${x.template} (PNG) */
  template: string
}

type _InfrastSkillGroupElem = {
  Doc?: string
  desc: string
  /** Efficiency assuming the group is formed. */
  efficient: _InfrastEfficiency
  /** Acceptable options */
  skills: _InfrastBskill[]
}

/** For skill combinations within a single facility. */
type _InfrastSkillGroup = {
  allowExternal?: boolean
  /** Minimum required variables */
  condition?: {
    [K in keyof Status]: number
  }
  desc: string
  necessary: _InfrastSkillGroupElem[]
  optional: _InfrastSkillGroupElem[] & {
    /** Operator names */
    filter?: string[]
  }
}

type _InfrastFacility = {
  maxNumOfOpers: _Integer
  products: _InfrastProducts[]
  skills: {
    [K in _InfrastBskill]: _InfrastSkill
  }
  skillsGroup: _InfrastSkillGroup[]
  skillsGroup_Doc?: string
}

type _InfrastRoom = 'Trade' | 'Power' | 'Mfg' | 'Office' | 'Reception' | 'Dorm' | 'Control'

/** Data for infrast skills (used for Infrast in default [single-facility] shift mode) 
 * @see asst::InfrastConfig */
export type InfrastJson = {
  roomType: _InfrastRoom[]
} & {
  [K in _InfrastRoom]: _InfrastFacility
}

type _ItemIndexItem = {
  classifyType: 'NONE' | 'MATERIAL' | 'CONSUME' | 'NORMAL'
  description: string
  /** -> template/items/${x.icon} (PNG) */
  icon: string
  name: string
  sortId: _Integer
  usage: string
}
/** List of items for recognition function, monolingual.
 * @see ItemConfig */
type ItemIndexJson = {
  [K in string]: _ItemIndexItem
}

/** @see asst::OcrConfig */
export type OcrConfigJson = {
  /** OCR confusables that are treated as equivalent in string matching. */
  equivalence_classes: string[][]
}

type _RecruitmentJsonOp = {
  id: _BattleDataCharKey
  name: string
  rarity: 1 | 2 | 3 | 4 | 5 | 6
  tags: string[]
}

/** For recruit task. Monolingual json. 
 * @see asst::RecruitConfig */
export type RecruitmentJson = {
  operators: _RecruitmentJsonOp[]
  /** zh tag -> local tag */
  tags: {
    [K in string]: string
  }
}

type _StageDrop = {
  dropType: 'EXTRA_DROP' | 'SPECIAL_DROP' | 'FURNITURE'
  itemId: keyof ItemIndexJson
}

type _Stage = {
  /** Sanity cost */
  apCost: _Integer
  /** UI-visible code, e.g. 3-10 */
  code: string
  /** Possible drops */
  dropInfos: _StageDrop[]
  /** Internal stageId, visible from map sites and penguin statistics */
  stageId: string
}
/** @see asst::StageDropsConfig */
export type StagesJson = _Stage[]

/** Not used by core. */
export type VersionJson = {
  activity: {
    name: string
    time: _Integer
  }
  gacha: {
    pool: string
    time: _Integer
  }
  /** %Y-%m-%d %H:%M:%S.000 when UTC+8 */
  last_updated: string
}

/** @see asst::TilePack */
export type TilePosOverviewJson = {
 
}
