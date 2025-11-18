"use client";

import { fadeTransition, fadeVariants } from "@/app/_animations/fadeVariants";

import { motion } from "motion/react";
import { useAnimation } from "@/app/providers";

export default function DataPrivacy() {
  const { isLoaded } = useAnimation();

  return (
    <section className="flex flex-col justify-center items-center text-foreground pointer-events-none h-full content-gradient">
      <div className="px-4 max-w-4xl z-10 flex flex-col h-full w-full justify-center items-center pointer-events-auto overflow-y-auto">
        <motion.div
          className="flex flex-col"
          variants={fadeVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          transition={fadeTransition}
        >
          <h1 className="text-3xl/snug s:text-4xl/snug md:text-5xl/snug font-medium">
            Data Privacy & Visibility
          </h1>

          <p className="text-xl md:text-2xl text-foreground/60 mb-8 md:mb-12 font-light italic">
            Understanding what data is visible to whom in your organization
          </p>

          <p className="text-base text-foreground/80 mb-8">
            Transparency and privacy are core to how Sentra works. This page
            explains exactly what data different roles in your organization can
            access, how we process information, and what protections are in
            place.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              What is &quot;Company Memory&quot;?
            </h3>
            <p className="text-gray-800">
              Company memory is Sentra&apos;s shared knowledge base containing
              summaries, decisions, and action items from meetings, check-ins,
              and other data sources. It helps teams stay aligned by acting as a
              shared source of truth.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200  rounded-lg p-6 mb-8">
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              Key Privacy Principle
            </h3>
            <p className="text-blue-800">
              Raw sensitive data (like full transcripts) stays with the people
              who generated it. Workspace admins and external team members only
              see processed insights and summaries.
            </p>
          </div>

          <h2 className="text-2xl font-medium text-foreground mb-6 mt-12">
            Data Sources & Privacy Levels
          </h2>

          {/* Voice Check-ins Section */}
          {/*<div className="border border-foreground/20 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-medium text-foreground">
                1. Sentra&apos;s check-ins (1:1)
              </h3>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                Personal/Confidential
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-foreground mb-2">
                  What We Collect
                </h4>
                <ul className="text-sm text-foreground/80 space-y-1">
                  <li>• Voice recording</li>
                  <li>• Transcription</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">
                  What We Generate
                </h4>
                <ul className="text-sm text-foreground/80 space-y-1">
                  <li>• Summary</li>
                  <li>• Key decisions</li>
                  <li>• Status updates</li>
                  <li>• Action items</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-foreground mb-3">
                  What event participants can see
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-foreground/80">
                      AI-generated summary and insights
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-foreground/80">Transcript</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-3">
                  What non-participant workspace members can see
                </h4>
                <div className="ml-4 space-y-3 flex flex-row gap-4">
                  <div>
                    <h5 className="font-medium text-foreground/90 mb-2">
                      1. Admins:
                    </h5>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <span className="text-blue-500 mr-2">◦</span>
                        <span className="text-foreground/80 text-sm">
                          Aggregated high level insights only *
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-red-500 mr-2">✗</span>
                        <span className="text-foreground/80 text-sm">
                          No access to raw recordings or transcripts
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-foreground/90 mb-2">
                      2. Members:
                    </h5>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-foreground/80 text-sm">
                          Existence of check-in
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <span className="text-red-500 mr-2">✗</span>
                        <span className="text-foreground/80 text-sm">
                          No access to any data from private check-ins
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-3">
                  AI Processing
                </h4>
                <p className="text-foreground/80 text-sm">
                  Priority extraction, blocker identification.{" "}
                  <span className="text-blue-600">
                    Prompts will be open sourced to organizations who use
                    Sentra.
                  </span>
                </p>
              </div>
            </div>

            {/* <div className="mt-4 p-4 bg-gray-50 rounded border-l-4 border-blue-500">
              <h5 className="font-medium text-foreground mb-2">
                * Example of high level insights:
              </h5>
              <div className="text-sm text-foreground/80 space-y-2">
                <p>
                  <strong>Raw:</strong> "I'm really struggling with the backend
                  refactor and feel like I'm falling behind on the sprint
                  goals..."
                </p>
                <p>
                  <strong>Processed:</strong> "Team member needs support with
                  backend refactor; at risk for sprint delivery"
                </p>
              </div>
            </div> */}{/*
          </div>*/}

          {/* Meeting Data Section */}
          <div className="border border-foreground/20 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-medium text-foreground">
                Meeting Data
              </h3>
              {/*<span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                Participant-Only for Raw Data
              </span>*/}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-yellow-900 mb-2">
                🔒 Private Meetings
              </h4>
              <p className="text-yellow-800 text-sm">
                Any participant can mark a meeting as <strong>PRIVATE</strong>{" "}
                by typing <strong>@sentra private</strong> in the meeting chat
                during a meeting, or marking it private post-meeting on the web
                dashboard. Private meetings are{" "}
                <strong>never added to company memory</strong> and remain
                visible only to participants.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-foreground mb-2">
                  What We Collect
                </h4>
                <ul className="text-sm text-foreground/80 space-y-1">
                  <li>• Meeting transcripts</li>
                  <li>• Participant list</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">
                  What We Generate
                </h4>
                <ul className="text-sm text-foreground/80 space-y-1">
                  <li>• Summary</li>
                  <li>• Key decisions</li>
                  <li>• Status updates</li>
                  <li>• Action items</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-foreground mb-3">
                  What event participants can see
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-foreground/80">
                      Full meeting transcript
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-foreground/80">
                      AI-generated summary and insights
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-foreground/80">
                      Action items and key decisions
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-foreground/80">
                      Can share with specific non-participants
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-3">
                  What non-participant workspace members can see
                </h4>
                <div className="ml-4 space-y-3 flex flex-row gap-4">
                  <div>
                    <h5 className="font-medium text-foreground/90 mb-2">
                      1. Admins:
                    </h5>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-foreground/80 text-sm">
                          Public meeting notes and summaries
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-foreground/80 text-sm">
                          Any meeting shared with them
                        </span>
                      </div>
                      {/*<div className="flex items-center">
                        <span className="text-red-500 mr-2">✗</span>
                        <span className="text-foreground/80 text-sm">
                          No access to raw transcripts
                        </span>
                      </div>*/}
                      <div className="flex items-center">
                        <span className="text-red-500 mr-2">✗</span>
                        <span className="text-foreground/80 text-sm">
                          No access to private meetings at all
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-foreground/90 mb-2">
                      2. Members:
                    </h5>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-foreground/80 text-sm">
                          Access to meetings they attended
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-foreground/80 text-sm">
                          Any meeting shared with them
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-red-500 mr-2">✗</span>
                        <span className="text-foreground/80 text-sm">
                          No access to other meeting notes or transcripts
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-red-500 mr-2">✗</span>
                        <span className="text-foreground/80 text-sm">
                          No access to private meetings at all
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-3">
                  AI Processing
                </h4>
                <p className="text-foreground/80 text-sm">
                  Summary generation, action item extraction
                </p>
              </div>
            </div>

            {/* <div className="mt-4 p-4 bg-gray-50 rounded border-l-4 border-orange-500">
              <h5 className="font-medium text-foreground mb-2">
                Example of data processing:
              </h5>
              <div className="text-sm text-foreground/80 space-y-2">
                <p>
                  <strong>Raw:</strong> "John mentioned the API endpoint is
                  breaking for user authentication and Sarah said she can fix it
                  by Friday"
                </p>
                <p>
                  <strong>Processed:</strong> "Decision: Sarah to fix
                  authentication API by Friday"
                </p>
              </div>
            </div> */}
          </div>

          {/* Additional Privacy Controls */}
          <h2 className="text-2xl font-medium text-foreground mb-6 mt-12">
            Additional Privacy Controls
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="border border-foreground/20 rounded-lg p-6">
              <h3 className="text-lg font-medium text-foreground mb-3">
                Data Retention
              </h3>
              <ul className="text-sm text-foreground/80 space-y-2">
                <li>• Private meetings are never added to company memory</li>
                <li>• You can request deletion anytime</li>
              </ul>
            </div>

            <div className="border border-foreground/20 rounded-lg p-6">
              <h3 className="text-lg font-medium text-foreground mb-3">
                Encryption & Security
              </h3>
              <ul className="text-sm text-foreground/80 space-y-2">
                <li>• End-to-end encryption in transit</li>
                <li>• AES-256 encryption at rest</li>
                <li>• SOC 2 Type II compliant</li>
                <li>• Regular security audits</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-medium text-foreground mb-6">
            Your Rights & Controls
          </h2>

          <div className="space-y-4 mb-8">
            <div className="flex items-start space-x-3">
              <span className="text-green-500 mt-1">✓</span>
              <div>
                <h4 className="font-medium text-foreground">
                  Access Your Data
                </h4>
                <p className="text-sm text-foreground/80">
                  Download all your data at any time by contacting us at{" "}
                  <a href="mailto:contact@sentra.app" className="text-blue-500">
                    contact@sentra.app
                  </a>
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-500 mt-1">✓</span>
              <div>
                <h4 className="font-medium text-foreground">
                  Delete Your Data
                </h4>
                <p className="text-sm text-foreground/80">
                  Request immediate deletion of specific recordings or all data
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-500 mt-1">✓</span>
              <div>
                <h4 className="font-medium text-foreground">Control Sharing</h4>
                <p className="text-sm text-foreground/80">
                  Choose what insights are shared with your team and workspace
                  admins
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-medium text-green-900 mb-2">
              Questions or Concerns?
            </h3>
            <p className="text-green-800 mb-3">
              We&apos;re committed to transparency. If you have questions about
              data privacy or want to exercise any of your rights, reach out to
              us.
            </p>
            <p className="text-green-800">
              Email: <span className="font-medium">contact@sentra.app</span>
            </p>
          </div>

          <p className="text-sm text-foreground/60 mb-8 italic">
            Last Updated: July 18, 2025
          </p>
        </motion.div>
      </div>
    </section>
  );
}
