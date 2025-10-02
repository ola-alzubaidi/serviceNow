# ServiceNow Integration App

A Next.js application that connects to ServiceNow instances using OAuth authentication to manage incidents, users, and other ServiceNow data.

## Features

- **OAuth Authentication**: Secure connection to ServiceNow using OAuth 2.0
- **Incident Management**: View and manage ServiceNow incidents
- **User Management**: Browse and manage ServiceNow users
- **Responsive Design**: Modern UI built with Tailwind CSS
- **TypeScript Support**: Full type safety throughout the application
- **Real-time Data**: Live data from your ServiceNow instance

## Prerequisites

- Node.js 18+ 
- A ServiceNow instance with OAuth configured
- ServiceNow admin access to configure OAuth applications

## ServiceNow OAuth Setup

Before running the application, you need to configure OAuth in your ServiceNow instance:

### 1. Create OAuth Application

1. Log into your ServiceNow instance as an administrator
2. Navigate to **System OAuth** > **Application Registry**
3. Click **New** to create a new OAuth application
4. Fill in the following details:
   - **Name**: ServiceNow Integration App
   - **Client ID**: Generate a unique client ID
   - **Client Secret**: Generate a secure client secret
   - **Redirect URL**: `http://localhost:3000/api/auth/callback/servicenow`
   - **Active**: Check this box
5. Save the application

### 2. Configure OAuth Provider

1. Navigate to **System OAuth** > **OAuth Providers**
2. Ensure the default OAuth provider is configured for your instance

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd servicenow-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:

```env
# ServiceNow OAuth Configuration
SERVICENOW_INSTANCE_URL=https://your-instance.service-now.com
SERVICENOW_CLIENT_ID=your_client_id_from_servicenow
SERVICENOW_CLIENT_SECRET=your_client_secret_from_servicenow
SERVICENOW_REDIRECT_URI=http://localhost:3000/api/auth/callback/servicenow

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here_generate_a_secure_random_string

# App Configuration
NEXT_PUBLIC_APP_NAME="ServiceNow Integration"
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. Click "Sign in with ServiceNow" to authenticate

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/     # NextAuth.js configuration
│   │   └── servicenow/             # ServiceNow API endpoints
│   ├── auth/                       # Authentication pages
│   └── page.tsx                    # Main dashboard
├── components/
│   ├── Dashboard.tsx               # Main dashboard component
│   ├── IncidentCard.tsx            # Incident display component
│   ├── SessionProvider.tsx         # NextAuth session provider
│   └── UserCard.tsx                # User display component
└── lib/
    ├── auth.ts                     # Authentication configuration
    └── servicenow.ts               # ServiceNow API client
```

## API Endpoints

The application provides the following API endpoints:

- `GET /api/servicenow/incidents` - Fetch incidents from ServiceNow
- `GET /api/servicenow/users` - Fetch users from ServiceNow  
- `GET /api/servicenow/profile` - Get current user profile

All endpoints require authentication and automatically handle OAuth token refresh.

## Customization

### Adding New Tables

To fetch data from additional ServiceNow tables:

1. Add a new method to the `ServiceNowClient` class in `src/lib/servicenow.ts`
2. Create a corresponding API route in `src/app/api/servicenow/`
3. Add UI components to display the data

### Styling

The application uses Tailwind CSS for styling. You can customize the appearance by modifying the Tailwind classes in the components.

## Troubleshooting

### Common Issues

1. **OAuth Configuration Error**: Ensure your ServiceNow OAuth application is properly configured with the correct redirect URI
2. **Authentication Failed**: Check that your environment variables are correctly set
3. **API Errors**: Verify that your ServiceNow instance URL is accessible and the user has proper permissions

### Debug Mode

To enable debug logging, add the following to your `.env.local`:

```env
NEXTAUTH_DEBUG=true
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
