import React, { useState, useEffect, ReactNode } from "react";
import { Dimensions, StyleSheet, SafeAreaView } from "react-native";

interface ContainerProps {
  children?: ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));

  useEffect(() => {
    const handleChange = ({ window }) => {
      setDimensions(window);
    };

    const subscription = Dimensions.addEventListener("change", handleChange);
    return () => {
      subscription?.remove();
    };
  }, []);

  const styles = getStyles(dimensions);

  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
};

const getStyles = (dimensions) => {
  const { width, height } = dimensions;

  if (width > height) {
    return StyleSheet.create({
      container: {
        flex: 1,
        flexDirection: "row",
        padding: 10,
      },
    });
  } else {
    return StyleSheet.create({
      container: {
        flex: 1,
        flexDirection: "column",
        padding: 10,
        margin: 10,
      },
    });
  }
};

export default Container;
