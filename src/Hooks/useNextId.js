const useNextId = (length = 8) => {
  const nextId = () => (Math.random() + 1).toString(36).substring(2, length + 2);

  return {
    nextId,
  };
};

export default useNextId;
