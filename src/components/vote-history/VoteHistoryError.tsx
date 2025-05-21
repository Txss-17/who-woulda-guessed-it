
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const VoteHistoryError = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto mt-8 text-center">
      <p>Historique non trouvé</p>
      <Button onClick={() => navigate("/")} className="mt-4">Retour à l'accueil</Button>
    </div>
  );
};

export default VoteHistoryError;
