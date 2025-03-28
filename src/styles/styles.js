import { StyleSheet, Platform } from 'react-native';

const GlobalStyles = {
  // ==================== TEXT STYLES ==================== //
  text: StyleSheet.create({
    base: {
      fontSize: 16,
      fontFamily: 'Akzidenz-grotesk-light',
    },
    black: {
      color: '#000000',
      fontSize: 16,
      fontFamily: 'Akzidenz-grotesk-light',
    },
    bulletPoint: {
      color: "#32CD32",
      fontSize: 20,
      marginRight: 8,
    },
    closeButton: {
      color: "#ffffff",
      marginTop: 10,
      fontSize: 16,
    },
    error: {
      color: "#FF0000",
      marginBottom: 10,
      fontSize: 14,
    },
    headerLg: {
      color: '#ffffff',
      fontSize: 22,
      fontFamily: 'Akzidenz-grotesk-light',
      paddingBottom: 10,
    },
    headerMd: {
      color: '#ffffff',
      fontSize: 18,
      fontFamily: 'Akzidenz-grotesk-light',
    },
    highlight: {
      color: "#FFA500",
      fontWeight: "bold",
      fontSize: 16,
      fontFamily: "Akzidenz-grotesk-bold",
    },
    link: {
      fontSize: 16,
      color: "#007AFF",
      textDecorationLine: "underline",
      fontFamily: "Akzidenz-grotesk-light",
    },
    translucent: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: 16,
      fontFamily: 'Akzidenz-grotesk-light',
    },
    translucentSmall: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: 14,
      fontFamily: 'Akzidenz-grotesk-light',
    },
    white: {
      color: '#ffffff',
      fontSize: 16,
      fontFamily: 'Akzidenz-grotesk-light',
    },
  }),

  // ==================== BUTTON STYLES ==================== //
  button: StyleSheet.create({
    base: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    primary: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      backgroundColor: '#78290f',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 10,
    },
    secondary: {
      backgroundColor: '#869ba1',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 10,
    },
    small: {
      paddingVertical: 5,
      paddingHorizontal: 5,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
    },
    text: {
      color: '#ffffff',
      fontSize: 18,
      fontFamily: 'Akzidenz-grotesk-light',
    },
    textSmall: {
      color: '#ffffff',
      fontSize: 14,
      fontFamily: 'Akzidenz-grotesk-light',
      textAlign: 'center',
    },
  }),

  // ==================== CONTAINER STYLES ==================== //
  container: StyleSheet.create({
    base: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    centered: {
      width: '100%',
      alignItems: 'center',
    },
    centeredFullScreen: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    content: {
      flex: 1,
      zIndex: 2,
    },
    form: {
      width: '80%',
      alignItems: 'center',
    },
    fullPage: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingTop: 60,
      paddingHorizontal: 40,
    },
    gradient: {
      flex: 1,
      width: "100%",
      height: "100%",
      position: "absolute",
    },
    image: {
      position: "absolute",
      width: "100%",
      height: "100%",
      zIndex: 1,
    },
    scroll: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
  }),

  // ==================== INPUT STYLES ==================== //
  input: StyleSheet.create({
    container: {
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      marginBottom: 10,
      padding: 10,
      borderRadius: 20,
      width: '100%',
      justifyContent: 'flex-start',
    },
    field: {
      width: '100%',
      padding: 15,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      borderRadius: 10,
      color: '#000000',
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.5)',
      marginBottom: 10,
    },
    label: {
      alignSelf: 'flex-start',
      paddingLeft: 10,
      paddingBottom: 5,
    },
    multiline: {
      color: "#000",
      fontSize: 14,
      minHeight: 40,
      textAlignVertical: "top",
      width: "100%",
    },
  }),

  // ==================== LOGO STYLES ==================== //
  logo: StyleSheet.create({
    image: {
      width: 130,
      height: 120,
      marginBottom: 10,
    },
    smallImage: {
      width: 60,
      height: 60,
      marginBottom: 10,
    },
    textLarge: {
      color: '#ffffff',
      fontSize: 90,
      fontFamily: 'Akzidenz-grotesk-light',
    },
    textSmall: {
      fontSize: 24,
      marginHorizontal: 5,
      color: '#ffffff',
      fontFamily: 'Akzidenz-grotesk-light',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },
  }),

  // ==================== NAVIGATION / BOTTOM BAR ==================== //
  nav: StyleSheet.create({
    bottomBarContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      backgroundColor: "#001524",
      paddingVertical: 10,
    },
    topBarContainer: {
      flexDirection: "row",          
      alignItems: "center",         
      justifyContent: "flex-start",  
      backgroundColor: "#001524",    
      paddingVertical: 10,
      paddingHorizontal: 16,
    },
    safeArea: {
      backgroundColor: "#001524",
      width: "100%",
    },
    iconContainer: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderRadius: 30,
      padding: 10,
    },
    activeIconContainer: {
      backgroundColor: "rgba(255, 125, 0, 0.2)",
    },
    iconRow: {
      flexDirection: "row",
      gap: 10,
    },
  }),

  // ==================== MODAL STYLES ==================== //
  modal: StyleSheet.create({
    bottomContainer: {
      height: "75%",
      width: "90%",
      backgroundColor: "#15616D",
      borderTopLeftRadius: 100,
      borderTopRightRadius: 100,
      padding: 20,
      alignSelf: "center",
      alignItems: "center",
    },
    bottomOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    container: {
      width: "80%",
      padding: 20,
      backgroundColor: "#001524",
      borderRadius: 10,
      alignItems: "center",
    },
    content: {
      width: "100%",
      alignItems: "center",
    },
    overlay: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      paddingTop: "45%",
    },
  }),

  // ==================== FILE PREVIEW STYLES ==================== //
  filePreview: StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingTop: Platform.OS === "android" ? 32 : 48,
      paddingBottom: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: "#ccc",
      backgroundColor: "#fff",
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      flex: 1,
      color: "#111",
    },
    previewContainer: {
      flex: 1,
      backgroundColor: "#f9f9f9",
    },
    unsupportedText: {
      color: "#444",
      fontSize: 16,
      textAlign: "center",
      marginBottom: 12,
      fontFamily: "Akzidenz-grotesk-light",
    },
    unsupportedContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    zoomableImage: {
      width: "100%",
      height: 400,
    },
    zoomableContainer: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
    },
  }),

  // ==================== PRIORITY STYLES ==================== //
  priority: StyleSheet.create({
    base: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      marginHorizontal: 6,
    },
    high: {
      backgroundColor: "#dc143c",
    },
    medium: {
      backgroundColor: "#FFA500",
    },
    low: {
      backgroundColor: "#2e8b57",
    },
    text: {
      color: "#fff",
      fontWeight: "bold",
      textTransform: "capitalize",
    },
    optionsRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10,
    },
  }),

  // ==================== UTILITY / ROWS ==================== //
  utility: StyleSheet.create({
    clickableRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      alignSelf: "stretch",
    },
    uploadRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "80%",
      marginTop: 20,
      marginBottom: 10,
    },
  }),

  // ==================== LAYOUT / SECTION STYLES ==================== //
    layout: StyleSheet.create({
      container: {
        backgroundColor: "#001524",
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
      },
      header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
      },
      title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF",
        fontFamily: "Akzidenz-grotesk-bold",
      },
      listItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 3,
      },
      seeMore: {
        marginTop: 10,
        alignSelf: "flex-end",
      },
    }),
  
};

export default GlobalStyles;