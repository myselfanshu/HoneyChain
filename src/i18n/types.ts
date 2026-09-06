export type LanguageCode = 
  | 'en' 
  | 'hi' 
  | 'bn' 
  | 'mr' 
  | 'gu' 
  | 'pa' 
  | 'or' 
  | 'as' 
  | 'ta' 
  | 'te' 
  | 'kn' 
  | 'ml';

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
];

export interface TranslationDictionary {
  // Navigation & Shell
  nav: {
    overview: string;
    smartHives: string;
    honeyPassport: string;
    intelligence: string;
    traceability: string;
    market: string;
    alerts: string;
    reports: string;
    settings: string;
    tagline: string;
    beekeeper: string;
    viewApiary: string;
    yourApiary: string;
    hives: string;
    healthy: string;
    expectedYield: string;
  };

  // Common UI
  common: {
    search: string;
    filter: string;
    all: string;
    status: string;
    healthy: string;
    verified: string;
    inspect: string;
    watch: string;
    optimal: string;
    elevated: string;
    critical: string;
    warning: string;
    save: string;
    cancel: string;
    close: string;
    copy: string;
    copied: string;
    download: string;
    loading: string;
    language: string;
    selectLanguage: string;
    theme: string;
    lightTheme: string;
    darkTheme: string;
    date: string;
    today: string;
    yesterday: string;
    viewDetails: string;
    back: string;
    actions: string;
    notes: string;
    active: string;
    inactive: string;
    new: string;
    resolved: string;
    acknowledged: string;
    shareTelemetry: string;
    linkCopied: string;
    brandName: string;
    brandSub: string;
    brandFullName: string;
    excellent: string;
    good: string;
    fair: string;
    needsAttention: string;
    kg: string;
    celsius: string;
  };

  // Hero & Landing
  hero: {
    tagline: string;
    taglineLead: string;
    taglineSub: string;
    subtitle: string;
    explorePlatform: string;
    verifyBatch: string;
    watchJourney: string;
    scrollExplore: string;
    ecosystemTitle: string;
    ecosystemHeading: string;
    ecosystemSubtitle: string;
    traceTitle: string;
    traceDesc: string;
    verifyTitle: string;
    verifyDesc: string;
    predictTitle: string;
    predictDesc: string;
    connectTitle: string;
    connectDesc: string;
    card1Badge: string;
    card1Desc: string;
    card1Button: string;
    card2Badge: string;
    card2Desc: string;
    card2Button: string;
    card3Badge: string;
    card3Desc: string;
    card3Button: string;
    card4Badge: string;
    card4Desc: string;
    card4Button: string;
  };

  // Overview Page
  overview: {
    greeting: string;
    healthSummary: string;
    hivesMonitored: string;
    healthyColonies: string;
    expectedYield: string;
    trustScore: string;
    consensusVerified: string;
    spatialMap: string;
    sectorNodes: string;
    clickTelemetry: string;
    all24Hives: string;
    liveConditions: string;
    average: string;
    viewAllConditions: string;
    showLess: string;
    observation: string;
    observationText: string;
    sensorSnapshot: string;
    viewRecommendation: string;
    hideRecommendation: string;
    whyItMatters: string;
    whyItMattersText: string;
    suggestedAction: string;
    suggestedActionText: string;
    confidenceLimitation: string;
    confidenceLimitationText: string;
    openTelemetry: string;
    activeHarvest: string;
    honeyVariety: string;
    originHive: string;
    batchMass: string;
    labMoisture: string;
    harvestStory: string;
    viewPassport: string;
    qrStory: string;
    recentActivity: string;
    activity1: string;
    activity1Time: string;
    activity2: string;
    activity2Time: string;
    activity3: string;
    activity3Time: string;
    condTemp: string;
    condTempDetail: string;
    condHumidity: string;
    condHumidityDetail: string;
    condWeight: string;
    condWeightDetail: string;
    condActivity: string;
    condActivityDetail: string;
    condRisk: string;
    condRiskDetail: string;
    trendHives: string;
    trendColonies: string;
    trendYield: string;
  };

  // Smart Hives
  smartHives: {
    title: string;
    subtitle: string;
    allHives: string;
    temp: string;
    humidity: string;
    weight: string;
    activity: string;
    acousticFreq: string;
    riskLevel: string;
    lastInspected: string;
    viewTelemetry: string;
    journalEntry: string;
    queenAge: string;
    hardwareStatus: string;
    batteryLevel: string;
    telemetryActive: string;
    telemetryEvents: string;
    fieldUnitArch: string;
    systemType: string;
    weightChange7d: string;
    aiRisk: string;
    activityTimeline: string;
    recentEvents: string;
    allEvents: string;
    evWeight: string;
    evTemp: string;
    evActivity: string;
    evHumidity: string;
  };

  // Honey Passport
  passport: {
    title: string;
    subtitle: string;
    batch: string;
    officialProvenance: string;
    origin: string;
    harvestHive: string;
    harvestDate: string;
    floralSource: string;
    quantity: string;
    quality: string;
    moisture: string;
    purity: string;
    hmfLevel: string;
    trustMethodology: string;
    viewScoreBreakdown: string;
    journeySnapshot: string;
    scoreDesc: string;
    gradeA: string;
    safeMoisture: string;
    unadulterated: string;
    rawActive: string;
    modalIntro: string;
    dim1Title: string;
    dim1Desc: string;
    dim2Title: string;
    dim2Desc: string;
    dim3Title: string;
    dim3Desc: string;
    dim4Title: string;
    dim4Desc: string;
  };

  // AI Intelligence
  intelligence: {
    title: string;
    subtitle: string;
    insightsTab: string;
    predictionsTab: string;
    recommendationsTab: string;
    observedBadge: string;
    forecastBadge: string;
    actionsBadge: string;
    simulatedBadge: string;
    colonyInsightTitle: string;
    colonyInsightSubtitle: string;
    riskFlagText: string;
    acousticDecline: string;
    tempStatus: string;
    weightDelta: string;
    viewDiagnostic: string;
    yieldForecastTitle: string;
    yieldForecastSubtitle: string;
    weatherOutlookTitle: string;
    weatherClear: string;
    weatherOptimal: string;
    wind: string;
    precip: string;
    foragingFavorable: string;
    horizon24h: string;
    horizon3d: string;
    horizon7d: string;
    projectedRange: string;
    foragingConditions: string;
    urgentPriority: string;
    superAddition: string;
    harvestWindow: string;
    dataBasis: string;
    observed: string;
    projected: string;
  };

  // Traceability
  traceability: {
    title: string;
    subtitle: string;
    supplyChainJourney: string;
    actorsInvolved: string;
    actorsSubtitle: string;
    blockchainLedger: string;
    merkleVerified: string;
    txnHash: string;
    blockHeight: string;
    signedBy: string;
    viewOnExplorer: string;
    roleBeekeeper: string;
    roleProcessor: string;
    rolePacker: string;
    roleDistributor: string;
    roleRetailer: string;
    evHarvestTitle: string;
    evHarvestDetails: string;
    evQualityTitle: string;
    evQualityDetails: string;
    evProcessedTitle: string;
    evProcessedDetails: string;
    evPackagedTitle: string;
    evPackagedDetails: string;
    evMarketTitle: string;
    evMarketDetails: string;
    viewSmartContract: string;
    contractTitle: string;
    contractStandard: string;
    contractDesc: string;
    contractAddress: string;
    network: string;
    consensusStatus: string;
    activeSyncing: string;
  };

  // Market
  market: {
    title: string;
    subtitle: string;
    filterAll: string;
    filterMustard: string;
    filterWildflower: string;
    filterAcacia: string;
    filterEucalyptus: string;
    sortBy: string;
    availableStock: string;
    buyNow: string;
    producerDirect: string;
    price: string;
    verifiedHarvest: string;
    viewDetailsProvenance: string;
    directPrice: string;
    qualityScore: string;
    labVerified: string;
    sealedJars: string;
    verifiedPartner: string;
    blockchainGuarantee: string;
    blockchainGuaranteeText: string;
    inspectPassport: string;
    consumerStory: string;
    sortLatest: string;
    sortScore: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
    locationUP: string;
    locationHP: string;
    locationKashmir: string;
    locationTamilNadu: string;
    floralMustard: string;
    floralWildflower: string;
    floralAcacia: string;
    floralEucalyptus: string;
  };

  // Alerts
  alerts: {
    title: string;
    subtitle: string;
    filterAll: string;
    filterCritical: string;
    filterWarnings: string;
    filterInfo: string;
    alert1Title: string;
    alert1Desc: string;
    alert2Title: string;
    alert2Desc: string;
    alert3Title: string;
    alert3Desc: string;
    alert4Title: string;
    alert4Desc: string;
    alert5Title: string;
    alert5Desc: string;
    acknowledge: string;
    emptyTitle: string;
    emptyDesc: string;
    time10m: string;
    time2h: string;
    time5h: string;
    time1d: string;
    time2d: string;
    northApiary: string;
    system: string;
  };

  // Reports
  reports: {
    title: string;
    subtitle: string;
    dateRange: string;
    generateReport: string;
    logFieldReport: string;
    recentReports: string;
    fieldReports: string;
    hiveHealth: string;
    totalYield: string;
    qualityScore: string;
    verifiedEvents: string;
    reportName: string;
    period: string;
    generated: string;
    download: string;
    preset7d: string;
    preset30d: string;
    preset90d: string;
    preset180d: string;
    ready: string;
    processing: string;
    yieldTrend: string;
    mockDataNotice: string;
    yieldTooltip: string;
    subFromLast: string;
    subOverDays: string;
    subAcrossBatches: string;
    subCompliance: string;
    report1Title: string;
    report2Title: string;
    report3Title: string;
    report4Title: string;
    custom: string;
    to: string;
    apply: string;
    logNew: string;
    noFieldReports: string;
    noFieldReportsSub: string;
  };

  // Settings
  settings: {
    title: string;
    subtitle: string;
    profileTab: string;
    preferencesTab: string;
    notificationsTab: string;
    apiTab: string;
    beekeeperProfile: string;
    fullName: string;
    emailAddress: string;
    role: string;
    primaryApiary: string;
    primaryLocation: string;
    editProfile: string;
    saveChanges: string;
    settingsSaved: string;
    themeAppearance: string;
    themeDesc: string;
    languagePref: string;
    languageDesc: string;
    tempUnits: string;
    tempUnitsDesc: string;
    weightUnits: string;
    weightUnitsDesc: string;
    emailNotifications: string;
    emailNotificationsDesc: string;
    smsAlerts: string;
    smsAlertsDesc: string;
    weeklyDigest: string;
    weeklyDigestDesc: string;
    anomalyAlerts: string;
    anomalyAlertsDesc: string;
    security: string;
    password: string;
    changePassword: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    demoNotice: string;
    registeredDate: string;
  };

  // New Entry Landing Page
  entry: {
    tagline: string;
    taglineLead: string;
    taglineSub: string;
    subtitle: string;
    trustLine: string;
    signIn: string;
    createAccount: string;
    guestAccess: string;
    guestDesc: string;
    verifyJar: string;
    verifyJarDesc: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar3Title: string;
    pillar3Desc: string;
    backToEntry: string;
  };

  // Authentication Forms
  auth: {
    signInTitle: string;
    signInSubtitle: string;
    registerTitle: string;
    registerSubtitle: string;
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    rolePlaceholder: string;
    roleBeekeeper: string;
    roleAdmin: string;
    roleInspector: string;
    signInButton: string;
    registerButton: string;
    guestButton: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    switchToRegister: string;
    switchToSignIn: string;
    orContinueAs: string;
    captchaTitle: string;
    captchaPending: string;
    captchaVerified: string;
    demoSecurityMode: string;
    demoSecurityDesc: string;
    passwordMismatch: string;
    passwordTooShort: string;
    invalidEmail: string;
    nameRequired: string;
    authError: string;
    signingIn: string;
    registering: string;
    enteringAsGuest: string;
    loggedInAs: string;
    signOut: string;
    signOutConfirm: string;
    welcomeBack: string;
    accountCreated: string;
    guestWelcome: string;
    forgotPassword: string;
    passwordStrong: string;
    passwordWeak: string;
    showPassword: string;
    hidePassword: string;
  };

  // Guest Mode
  guest: {
    badge: string;
    modeBanner: string;
    restrictionNotice: string;
    signInPrompt: string;
    createAccountPrompt: string;
    canView: string;
    cannotModify: string;
    exploreMode: string;
  };

  // Consumer Verification & Story Page
  consumer: {
    verifiedProvenance: string;
    tagline: string;
    portalBadge: string;
    enterPlatform: string;
    mobileVerification: string;
    scanInstruction: string;
    verificationResult: string;
    verifiedBatch: string;
    batchId: string;
    storyTitle: string;
    storySubtitle: string;
    storyStatement: string;
    apiaryCoordinates: string;
    thankYou: string;
    stageHive: string;
    stageHarvested: string;
    stageVerified: string;
    stageProcessed: string;
    stagePackaged: string;
    stageMarket: string;
    viewFullStory: string;
    harvestedOn: string;
  };
}
