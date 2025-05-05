import Card from "@/components/campaign/Card";
//import CardCampaign from "@/components/CardCampaign";
import { ICampaign } from "@/interfaces/ICampaign.interface";
import { Flex } from "@chakra-ui/react";
import React from "react";

async function Campaign() {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/campaign`)
  const campaigns: ICampaign[] = await data.json()
  console.log(campaigns);

  return (
    <Flex my={100} wrap={"wrap"} justifyContent="center" gap={4}>
      {/* <CardCampaign /> */}
      {campaigns.map((campaign) => (
        <Card
          key={campaign.id}
          id={campaign.id}
          amount_target={campaign.amount_target}
          created_at={campaign.created_at}
          description={campaign.description}
          due_date={campaign.due_date}
          end_date={campaign.end_date}
          name={campaign.name}
          owner_id={campaign.owner_id}
          start_date={campaign.start_date}
          status={campaign.status}
          updated_at={campaign.updated_at}
        />
      ))}
    </Flex>
  );
}

export default Campaign;
