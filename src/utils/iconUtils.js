// utils/iconUtils.js

import {
    Pencil,
    Paperclip,
    Image,
    MessageCircle,
    Dot,
  } from "lucide-react-native";
  
  /**
   * Returns a Lucide icon component based on activity type.
   * @param {string} type - Activity type (e.g. 'file', 'image', 'status')
   * @param {number} size - Icon size (default 18)
   * @param {string} color - Icon color (default #15616D)
   * @returns {JSX.Element}
   */
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

  