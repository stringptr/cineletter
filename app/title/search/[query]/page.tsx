import Card from "@/components/Card";

export default function MoviePage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center gap-8 p-8">
      <Card
        title="Wicked: For Good"
        year="2025"
        director="Jon M. Chu"
        description="As an angry mob rises against the Wicked Witch, Glinda and Elphaba will need to come together one final time. With their singular friendship now the fulcrum of their futures, they will need to truly see each other, with honesty and empathy, if they are to change themselves, and all of Oz, for good."
        poster="/wicked_fg.jpg"
        genre={["Musical", "Fantasy", "Drama"]}
      />
      <Card
        title="Wicked"
        year="2024"
        director="Jon M. Chu"
        description="In the land of Oz, ostracized and misunderstood green-skinned Elphaba is forced to share a room with the popular aristocrat Glinda at Shiz University, and the two's unlikely friendship is tested as they begin to fulfill their respective destinies as Glinda the Good and the Wicked Witch of the West."
        poster="/wicked.jpg"
        genre={["Musical", "Fantasy", "Drama"]}
      />
      <Card
        title="Barbie"
        year="2023"
        director="Greta Gerwig"
        description="Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans."
        poster="/barbie.jpg"
        genre={["Fantasy", "Comedy", "Drama"]}
      />
    </div>
  );
}