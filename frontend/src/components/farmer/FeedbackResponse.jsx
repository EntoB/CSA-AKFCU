import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Draggable from 'react-draggable';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import StarIcon from '@mui/icons-material/Star';

function PaperComponent(props) {
    const nodeRef = React.useRef(null);
    return (
        <Draggable
            nodeRef={nodeRef}
            handle="#draggable-feedback-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} ref={nodeRef} />
        </Draggable>
    );
}

export default function FeedbackResponse({ open, onClose, message = "Thank you for your feedback!" }) {
    // Fun icon selection: randomly pick one for a playful effect
    const icons = [
        <CheckCircleIcon sx={{ fontSize: 60, color: '#16a34a' }} />, // Green
        <EmojiEmotionsIcon sx={{ fontSize: 60, color: '#1e293b' }} />, // Navy Blue
        <StarIcon sx={{ fontSize: 60, color: '#f59e42' }} />, // Golden
    ];
    const [icon] = React.useState(() => icons[Math.floor(Math.random() * icons.length)]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-feedback-dialog-title"
        >
            <DialogTitle
                style={{
                    cursor: 'move',
                    background: 'linear-gradient(90deg, #16a34a 60%, #1e293b 100%)',
                    color: '#fff',
                    fontWeight: 'bold',
                    textAlign: 'center',
                }}
                id="draggable-feedback-dialog-title"
            >
                Feedback Received!
            </DialogTitle>
            <DialogContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    bgcolor: '#f6ffe9',
                    minWidth: 320,
                    py: 3,
                }}
            >
                <div style={{ marginBottom: 12 }}>{icon}</div>
                <Typography
                    variant="h6"
                    sx={{
                        color: '#16a34a',
                        fontWeight: 'bold',
                        mb: 1,
                        textAlign: 'center',
                    }}
                >
                    {message}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: '#1e293b',
                        textAlign: 'center',
                    }}
                >
                    You can drag this dialog around for fun!
                </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', bgcolor: '#fdf6e3' }}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    sx={{
                        bgcolor: '#16a34a',
                        color: '#fff',
                        fontWeight: 'bold',
                        px: 4,
                        '&:hover': {
                            bgcolor: '#1e293b',
                            color: '#f59e42',
                        },
                        borderRadius: 2,
                    }}
                >
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
}