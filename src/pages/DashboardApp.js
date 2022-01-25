// material
import { Box, Grid, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { AppCard } from '../components/_dashboard/app';

// data
import { branches } from '../assets/data/branchData';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  return (
    <Page title="Main Page | ARP">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Hi, Welcome back</Typography>
        </Box>
        <Grid container spacing={3}>
          {branches.map((branch) => {
            if (!branch.show) return null;

            return (
              <Grid item xs={12} sm={6} md={3} key={branch.title}>
                <AppCard
                  color={branch.color}
                  icon={branch.icon}
                  title={branch.title}
                  subtitle={branch.subtitle}
                  code={branch.code}
                />
              </Grid>
            );
          })}
        </Grid>
        <br />
      </Container>
    </Page>
  );
}
