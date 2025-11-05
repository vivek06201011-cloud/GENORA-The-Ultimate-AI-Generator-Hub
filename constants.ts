
import type { Tool, Review } from './types';
import { ToolId } from './types';
import { TitleIcon } from './components/icons/TitleIcon';
import { DescriptionIcon } from './components/icons/DescriptionIcon';
import { UsernameIcon } from './components/icons/UsernameIcon';
import { SloganIcon } from './components/icons/SloganIcon';
import { HashtagIcon } from './components/icons/HashtagIcon';
import { OptimizerIcon } from './components/icons/OptimizerIcon';
import { ScoreIcon } from './components/icons/ScoreIcon';

export const TOOLS: Tool[] = [
  {
    id: ToolId.Title,
    title: 'YouTube Title Generator',
    description: 'Generate catchy titles for your videos.',
    Icon: TitleIcon,
  },
  {
    id: ToolId.Description,
    title: 'YouTube Description Generator',
    description: 'Create optimized and rich descriptions.',
    Icon: DescriptionIcon,
  },
  {
    id: ToolId.Username,
    title: 'Username Generator',
    description: 'Find stylish and unique usernames.',
    Icon: UsernameIcon,
  },
  {
    id: ToolId.Slogan,
    title: 'Slogan/Tagline Generator',
    description: 'Craft powerful slogans for your brand.',
    Icon: SloganIcon,
  },
  {
    id: ToolId.Hashtag,
    title: 'Hashtag Generator',
    description: 'Discover the best hashtags for your content.',
    Icon: HashtagIcon,
  },
  {
    id: ToolId.Optimizer,
    title: 'YouTube SEO Optimizer',
    description: 'Get a full SEO-optimized package.',
    Icon: OptimizerIcon,
  },
  {
    id: ToolId.Score,
    title: 'SEO Score Checker',
    description: 'Analyze and improve your SEO score.',
    Icon: ScoreIcon,
  },
];


export const REVIEWS: Review[] = [
  {
    avatar: `https://i.pravatar.cc/48?u=${Math.random()}`,
    username: '@TechVibes',
    rating: 5,
    text: 'GENORA is a game-changer! The YouTube Title Generator is pure magic. My CTR has skyrocketed since I started using it.',
  },
  {
    avatar: `https://i.pravatar.cc/48?u=${Math.random()}`,
    username: '@DesignBuddy',
    rating: 5,
    text: 'As a designer, the Slogan Generator is my secret weapon for branding projects. The results are always creative and on point.',
  },
  {
    avatar: `https://i.pravatar.cc/48?u=${Math.random()}`,
    username: '@MarketingMaven',
    rating: 5,
    text: 'The SEO Optimizer is insanely powerful. It gives me a full package that actually ranks. This is a must-have for any digital marketer.',
  },
    {
    avatar: `https://i.pravatar.cc/48?u=${Math.random()}`,
    username: '@CreatorFlow',
    rating: 5,
    text: 'I love how fluid and beautiful the whole website is. Using the tools feels futuristic and inspiring. Plus, the hashtag tool is brilliant!',
  },
];
