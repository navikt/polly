export const isLink = (text: string) => {
  try {
    new URL(text);
  } catch (_) {
    return false;
  }

  return true;
}

export const mapBool = (b?: boolean) => b === true ? true : b === false ? false : undefined
