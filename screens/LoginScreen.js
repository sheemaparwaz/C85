import React, { Component } from "react";
 import { View, ActivityIndicator } from "react-native";
  import firebase from "firebase";
  
  export default class LoadingScreen extends Component { 

    isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
          var providerData = firebaseUser.providerData;
          for (var i = 0; i < providerData.length; i++) {
            if (
              providerData[i].providerId ===
              firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
              providerData[i].uid === googleUser.getBasicProfile().getId()
            ) {
              // We don't need to reauth the Firebase connection.
              return true;
            }
          }
        }
        return false;
      };

    onSignIn = googleUser => {
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged(firebaseUser => {
          unsubscribe();
          // Check if we are already signed-in Firebase with the correct user.
          if (!this.isUserEqual(googleUser, firebaseUser)) {
            // Build Firebase credential with the Google ID token.
            var credential = firebase.auth.GoogleAuthProvider.credential(
              googleUser.idToken,
              googleUser.accessToken
            );
    
            // Sign in with credential from the Google user.
            firebase
              .auth()
              .signInWithCredential(credential)
              .then(function (result) {
                if (result.additionalUserInfo.isNewUser) {
                  firebase
                    .database()
                    .ref("/users/" + result.user.uid)
                    .set({
                      gmail: result.user.email,
                      profile_picture: result.additionalUserInfo.profile.picture,
                      locale: result.additionalUserInfo.profile.locale,
                      first_name: result.additionalUserInfo.profile.given_name,
                      last_name: result.additionalUserInfo.profile.family_name,
                      current_theme: "dark"
                    })
                    .then(function (snapshot) { });
                }
              })
              .catch(error => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
              });
          } else {
            console.log("User already signed-in Firebase.");
          }
        });
      };

    signInWithGoogleAsync = async () => {
        try {
          const result = await Google.logInAsync({
            behaviour: "web",
            androidClientId:
              "511152414476-3t5g2gtfa65ran0p3rpg533f4hs0h9d4.apps.googleusercontent.com",
            iosClientId:
              "511152414476-nld36j0v1fgprihclasb4m210neki0j8.apps.googleusercontent.com",
            webClientId:
            "511152414476-1ba1e0ptfvke56peo0qmlcna56b8bgib.apps.googleusercontent.com",
            scopes: ["profile", "email"]
          });
    
          if (result.type === "success") {
            this.onSignIn(result);
            return result.accessToken;
          } else {
            return { cancelled: true };
          }
        } catch (e) {
          console.log(e.message);
          return { error: true };
        }
      };
    componentDidMount() {
         this.checkIfLoggedIn()
         } 
         
         checkIfLoggedIn = () => { 
             firebase.auth().onAuthStateChanged((user) => { 
                 if (user) { 
                     this.props.navigation.navigate('DashboardScreen')
                } else { 
                    this.props.navigation.navigate('LoginScreen') 
            } 
        }) 
    } 
    render() {
         return ( 
         <View 
         style={{ 
             flex: 1, 
             justifyContent: "center",
              alignItems: "center" 
            }}
             > 
            <ActivityIndicator size="large" /> 
            </View> 
            ) 
        } 
    }
    // ios id = 511152414476-nld36j0v1fgprihclasb4m210neki0j8.apps.googleusercontent.com
    // android = 511152414476-3t5g2gtfa65ran0p3rpg533f4hs0h9d4.apps.googleusercontent.com
    // web = 511152414476-1ba1e0ptfvke56peo0qmlcna56b8bgib.apps.googleusercontent.com