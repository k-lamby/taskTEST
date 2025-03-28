import { StyleSheet } from 'react-native';

const GlobalStyles = StyleSheet.create({

  // ==================== TEXT STYLES ==================== //
  headerText: {
    color: '#ffffff',
    fontSize: 22,
    fontFamily: 'Akzidenz-grotesk-light',
  },
  subheaderText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Akzidenz-grotesk-light',
  },
  normalText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Akzidenz-grotesk-light',
  },
  normalTextBlack: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'Akzidenz-grotesk-light',
  },
  translucentText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    fontFamily: 'Akzidenz-grotesk-light',
  },
  closeButtonText: {
    color: "#ffffff",
    marginTop: 10,
    fontSize: 16,
  },
  bulletPoint: {
    color: "#32CD32",
    fontSize: 20,
    marginRight: 8,
  },

  // ==================== INPUT STYLES ==================== //
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 10,
    padding: 10,
    borderRadius: 20,
    width: '100%',
    justifyContent: 'flex-start',
  },
  textInput: {
    width: '100%',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
    color: '#000000',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.5)',
  },
  label: {
    alignSelf: 'flex-start',
    paddingLeft: 10,
    paddingBottom: 5,
  },

  // ==================== BUTTON STYLES ==================== //
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // --- Primary ---
  primaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#78290f',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Akzidenz-grotesk-light',
  },

  // --- Secondary ---
  secondaryButton: {
    backgroundColor: '#869ba1',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Akzidenz-grotesk-light',
  },

  // --- Small Buttons ---
  smallButton: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  smallPrimaryButton: {
    backgroundColor: '#Bc3908',
  },
  smallSecondaryButton: {
    backgroundColor: '#688e26',
  },
  smallButtonText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },

  // ==================== PRIORITY BUTTON STYLES ==================== //
  priorityOptions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  priorityButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginHorizontal: 6,
  },
  priorityButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  priorityButtonSelectedLow: {
    backgroundColor: "#2e8b57",
  },
  priorityButtonSelectedMedium: {
    backgroundColor: "#FFA500",
  },
  priorityButtonSelectedHigh: {
    backgroundColor: "#dc143c",
  },

  // ==================== MODAL STYLES ==================== //
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingTop: "45%",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "#001524",
    borderRadius: 10,
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    alignItems: "center",
  },
  bottomSlideUpModalContainer: {
    height: "75%",
    width: "90%",
    backgroundColor: "#15616D",
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    padding: 20,
    alignSelf: "center",
    alignItems: "center",
  },
  modalOverlayBottom: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },

  // ==================== CONTAINER STYLES ==================== //
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  fullPageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  contentContainer: {
    flex: 1,
    zIndex: 2,
  },
  gradientContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlayImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 1,
  },

  // ==================== SECTION / LIST STYLES ==================== //
  sectionContainer: {
    backgroundColor: "#001524",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 8,
  },
  seeMore: {
    marginTop: 10,
    alignSelf: "flex-end",
  },
  seeMoreText: {
    color: "#FFA500",
    fontWeight: "bold",
  },

  // ==================== NAVIGATION / BOTTOM BAR ==================== //
  bottomBarContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#001524",
    paddingVertical: 10,
  },
  bottomBarIconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 30,
    padding: 10,
  },
  bottomBarActiveIconContainer: {
    backgroundColor: "rgba(255, 125, 0, 0.2)",
  },
  bottomBarSafeArea: {
    backgroundColor: "#001524",
    width: "100%",
  },
  tightIconContainer: {
    flexDirection: "row",
    gap: 10,
  },

  // ==================== LOGO STYLES ==================== //
  logo: {
    width: 130,
    height: 120,
    marginBottom: 10,
  },
  logoText: {
    color: '#ffffff',
    fontSize: 90,
    fontFamily: 'Akzidenz-grotesk-light',
  },
});

export default GlobalStyles;