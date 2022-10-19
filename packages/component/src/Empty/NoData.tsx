import React from 'react'
import {
  Card,
  CardActionArea,
  CardMedia,
  Typography,
  Box,
  CardContent,
} from '@mui/material'

interface IProps {
  actionHandler?: null | (() => void)
  useImg?: boolean
}

const Empty = (props: IProps): React.ReactElement => {
  const { useImg } = props
  return (
    <Box sx={{ m: '0 auto', py: 3 }}>
      <Card sx={{ m: '0 auto', maxWidth: '300' }}>
        <CardActionArea>
          {useImg && (
            <CardMedia
              sx={{ width: 300, height: 300 }}
              image=''
              title='No Data'
            >
              <CardContent>
                <Typography gutterBottom variant='h5' component='h2'>
                  Error !
                </Typography>
                <Typography component='p'>Not Find Data</Typography>
              </CardContent>
            </CardMedia>
          )}
        </CardActionArea>
      </Card>
    </Box>
  )
}

export default Empty
