import { Box } from "grommet";
import React from "react";
import { AccountProfileShowcase } from "src/components/dashboard/AccountProfileShowcase";
import { ContentSelector } from "src/components/dashboard/ContentSelector";
import { AccountProfile } from "src/models/AccountProfile";
import { requireAuth } from "src/utils/requireAuth";

interface Props {
  profile: AccountProfile;
  tab: "weibo" | "followers" | "followings";
}

export const DashboardLayout: React.FC<Props> =
  requireAuth()<Props>(({ profile, tab, children  }) => {
    return (
      <Box fill gap="large" alignSelf="center" width={{ max: "large" }}>
        <AccountProfileShowcase
          registerTime={profile.registerTime}
          userId={profile.userId}
          username={profile.username}
        />
        <Box>
          <ContentSelector
            tab={tab}
            followersCount={profile.followersCount}
            followingsCount={profile.followingsCount}
            weiboCount={profile.weiboCount}
          />
        </Box>
        {children}
      </Box>
    );
  });

