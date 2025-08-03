import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-linkedin-blue to-linkedin-dark flex items-center justify-center p-4">
      <Card className="w-full max-w-lg mx-auto">
        <CardContent className="pt-8 pb-8 px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Logo size="md" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">LinkSphere</h1>
            <p className="text-gray-600">Connect, share, and grow your professional network</p>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <Button 
                onClick={() => window.location.href = '/auth'}
                className="w-full bg-linkedin-blue hover:bg-linkedin-dark text-white font-medium py-3 px-6 rounded-lg transition-colors"
                size="lg"
              >
                Sign In to Get Started
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4">
                <div className="w-12 h-12 bg-linkedin-light/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="fas fa-users text-linkedin-blue text-xl"></i>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Connect</h3>
                <p className="text-sm text-gray-600">Build your professional network</p>
              </div>
              <div className="p-4">
                <div className="w-12 h-12 bg-linkedin-light/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="fas fa-share-alt text-linkedin-blue text-xl"></i>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Share</h3>
                <p className="text-sm text-gray-600">Post updates and insights</p>
              </div>
              <div className="p-4">
                <div className="w-12 h-12 bg-linkedin-light/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="fas fa-chart-line text-linkedin-blue text-xl"></i>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Grow</h3>
                <p className="text-sm text-gray-600">Advance your career</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
