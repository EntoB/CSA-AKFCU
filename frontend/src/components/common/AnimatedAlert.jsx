import Alert from '@mui/joy/Alert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect } from 'react';

const AnimatedAlert = ({
    open,
    message,
    type = "success",
    onClose,
    successText = "Success",
    errorText = "Error",
    duration = 3500,
    ...props
}) => {
    useEffect(() => {
        if (open && duration > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [open, duration, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    style={{
                        position: 'fixed', // <-- changed from 'absolute' to 'fixed'
                        left: '50%',
                        top: 0,
                        transform: 'translateX(-50%)',
                        width: '100%',
                        maxWidth: 500,
                        zIndex: 1300, // higher z-index to be above most elements
                    }}
                >
                    <Alert
                        sx={{
                            alignItems: 'flex-start',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            letterSpacing: 0.5,
                            boxShadow: 'md',
                            ...props.sx
                        }}
                        startDecorator={<CheckCircleIcon />}
                        variant="soft"
                        color={type}
                        endDecorator={
                            <IconButton variant="soft" color={type} onClick={onClose}>
                                <CloseRoundedIcon />
                            </IconButton>
                        }
                    >
                        <div>
                            <div>{type === 'success' ? successText : errorText}</div>
                            <Typography level="body-sm" color={type}>
                                {message}
                            </Typography>
                        </div>
                    </Alert>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AnimatedAlert;