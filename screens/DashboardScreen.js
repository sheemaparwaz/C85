import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";

export default class DashboardScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>DashboardScreen</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
