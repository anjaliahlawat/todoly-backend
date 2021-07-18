const createPath = (folder1: string, folder2?: string): string => {
  let path: string;
  const path1 = folder1.toLowerCase().split(" ").join("-");
  if (folder2) {
    const path2 = folder2.toLowerCase().split(" ").join("-");
    path = `${path1}/${path2}`;
  } else {
    path = `${path1}`;
  }
  return path;
};

export default createPath;
