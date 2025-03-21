import { StyleSheet } from 'react-native';

const GlobalStyles = StyleSheet.create({
  // ===== GENERAL PAGE STYLES ===== //
  fullPageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  // ===== LOGO STYLES ===== //
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

  // ===== REUSABLE TEXT STYLES ===== //
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
  bulletPoint: {
    color: "#32CD32", 
    fontSize: 20,
    marginRight: 8,
  },

  // ===== FLEXIBLE BUTTON STYLES ===== //
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
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

  // ===== SECONDARY BUTTON STYLES ===== //
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

  // ===== SMALL BUTTON STYLES ===== //
  smallButton: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
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

  // ===== INPUT STYLES ===== //
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
  },

  // ===== GRADIENT CONTAINER ===== //
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
  contentContainer: {
    flex: 1,
    zIndex: 2,
  },

  // ===== MODAL STYLES ===== //
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-start", // Ensures modal starts from the top
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    paddingTop: "45%",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "#001524", // Dark blue background
    borderRadius: 10,
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#ffffff",
    marginTop: 10,
    fontSize: 16,
  },

  // ===== DARK BLUE CONTAINER (REUSABLE) ===== //
  // Dark blue background container
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
    // ===== TOP AND BOTTOM NAVBAR CONTAINER ===== //
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
});




export default GlobalStyles;