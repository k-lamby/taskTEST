//================== iconUtils.js ===========================//
// handles selecting the icon for the activity
//================================================================//
import {
    Pencil,
    Paperclip,
    Image,
    MessageCircle,
    Dot,
  } from "lucide-react-native";
  
  export const getActivityIcon = (type, size = 18, color = "#15616D") => {
    switch (type) {
      case "create":
      case "status":
        return <Pencil size={size} color={color} />;
      case "file":
        return <Paperclip size={size} color={color} />;
      case "image":
        return <Image size={size} color={color} />;
      case "message":
        return <MessageCircle size={size} color={color} />;
      default:
        return <Dot size={size} color={color} />;
    }
  };

  