
const GameListLoading = () => {
  return (
    <div className="text-center py-10">
      <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-muted-foreground">Chargement des parties...</p>
    </div>
  );
};

export default GameListLoading;
