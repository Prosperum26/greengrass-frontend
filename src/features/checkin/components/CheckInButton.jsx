import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui';

export const CheckInButton = ({ eventId, onSuccess }) => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => {
        onSuccess?.();
        navigate(`/checkin/${eventId}`);
      }}
      className="w-full"
    >
      Check-in sự kiện
    </Button>
  );
};

export default CheckInButton;
