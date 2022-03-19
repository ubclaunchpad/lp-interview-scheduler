import React from "react";

export function useSetBackground(image: string) {
  // image should be of the form "url('/(...).svg')"
  React.useLayoutEffect(() => {
    // set the background image of the entire page upon render
    document.body.style.backgroundImage = image;

    // remove the background image when the component unmounts
    return () => {
      document.body.style.backgroundImage = "";
    };
  }, [image]);
}
