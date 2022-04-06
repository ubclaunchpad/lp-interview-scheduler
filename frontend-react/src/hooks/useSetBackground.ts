import React from "react";

export function useSetBackgroundImage(image: string) {
  // image should be of the form "url('/(...).svg')"
  React.useLayoutEffect(() => {
    // set the background image of the entire page upon render
    document.body.style.backgroundImage = image;
    document.body.style.backgroundSize = "auto auto";
    document.body.style.backgroundRepeat = "no-repeat";

    // remove the background image when the component unmounts
    return () => {
      document.body.style.backgroundImage = "";
    };
  }, [image]);
}
