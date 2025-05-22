import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

function CouterCards({ data }) {
    return (
        <Box
            sx={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(4, 1fr)',
                },
                gap: 3,
                mb: 4,
            }}
        >
            {data.map((card) => (
                <Card
                    key={card.id}
                    sx={{
                        borderLeft: `8px solid ${card.borderColor}`,
                        background: card.color,
                        boxShadow: 3,
                        minHeight: 10,
                        maxHeight: 120,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'stretch',
                    }}
                >
                    <CardActionArea
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            height: '100%',
                            p: 2,
                        }}
                    >
                        {/* Icon: 20% */}
                        <Box
                            sx={{
                                flex: '0 0 20%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {card.icon}
                        </Box>
                        {/* Text and Number: 80% */}
                        <Box
                            sx={{
                                flex: '1 1 80%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                                pl: 2,
                                width: '100%',
                            }}
                        >
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 'bold',
                                    color: card.borderColor,
                                    fontSize: '1rem',
                                    mb: 0.5,
                                }}
                            >
                                {card.title}
                            </Typography>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#222',
                                    fontSize: '3rem',
                                    marginLeft: '10px',
                                }}
                            >
                                {card.count}
                            </Typography>
                        </Box>
                    </CardActionArea>
                </Card>
            ))}
        </Box>
    );
}

export default CouterCards;